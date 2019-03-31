const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const route = (params = "") => {
  const path = "/api/v1/users";
  return `${path}/${params}`;
};

describe("/users", () => {
  let mongoServer;
  let db;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(mongoUri);
    db = mongoose.connection;

    await User.insertMany([
      {
        admin: true,
        name: "admin",
        email: "admin@email.com",
        password: "hello789",
        cart: []
      },
      {
        admin: false,
        name: "customer1",
        email: "@email.com",
        password: "hello789",
        cart: []
      },
      {
        admin: false,
        name: "customer2",
        email: "aswr@email.com",
        password: "123abg",
        cart: []
      }
    ]);
  });

  afterAll(async () => {
    await db.dropCollection("users");
    mongoose.disconnect();
    await mongoServer.stop();
  });

  test("[GET] Should return details of all users and status code 200", async () => {
    const users = await User.find();
    const res = await request(app)
      .get(route())
      .expect(200);
    expect(res.body.length).toEqual(users.length);
  });

  test("[GET] Should get no user and status code 404", async () => {
    await User.deleteMany({});
    const uses = await User.find();
    const res = await request(app)
      .get(route())
      .expect(404);
    expect(res.body).toBe("No user found");
  });
});

describe("/users/:id", () => {
  let mongoServer;
  let db;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(mongoUri);
    db = mongoose.connection;

    await User.insertMany([
      {
        admin: false,
        name: "customer1",
        email: "abc@email.com",
        password: "hello789",
        cart: []
      },
      {
        admin: false,
        name: "customer2",
        email: "aswr@email.com",
        password: "123abg",
        cart: []
      }
    ]);
  });

  afterAll(async () => {
    await db.dropCollection("users");
    mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jwt.verify.mockRestore();
  });

  test("[GET] Should return user's id and cart with status code 200 provided the token is verified", async () => {
    const user = {
      name: "customer1",
      password: "hello789"
    };
    await bcrypt.compare.mockResolvedValue(true);
    await request(app)
      .post("/api/v1/auth/login")
      .send(user);

    await jwt.verify.mockResolvedValue(user);
    const expectedUser = await User.findOne({ name: "customer1" });
    const res = await request(app)
      .get(route(expectedUser._id))
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining({
      id: `${expectedUser._id}`,
      cart: expect.any(Array)
    }))
    await bcrypt.compare.mockRestore();
  });

  test("[GET] Should return status code 403 as token is invalid", async () => {
    const { _id } = await User.findOne({ name: "customer1" });
    await request(app)
      .get(route(_id))
      .expect(403);
  });

  test("[GET] Should return status code 404 as user is not found", async () => {
    jwt.verify.mockResolvedValue({ name: "customer1" });
    await request(app)
      .get(route("5c9f307cbfef67aaaaa00000"))
      .expect(404);
  });
});

xdescribe("/user/:id/cart", () => {
  let mongoServer;
  let db;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(mongoUri);
    db = mongoose.connection;

    await User.insertMany([
      {
        admin: false,
        name: "customer1",
        email: "abc@email.com",
        password: "hello789",
        cart: [
          {
            product: ["5c9da13f938c51001ea3c560"],
            quantity: 12
          },
          {
            product: ["5c9d9cc65f9be831985e48f6"],
            quantity: 3
          }
        ]
      },
      {
        admin: false,
        name: "customer2",
        email: "aswr@email.com",
        password: "123abg",
        cart: []
      }
    ]);
  });

  afterAll(async () => {
    await db.dropCollection("users");
    mongoose.disconnect();
    await mongoServer.stop();
  });

  test("[GET] Should return user's cart with status code 200 provided the token is verified", async () => {
    const user = {
      name: "customer1",
      password: "hello789"
    };
    await bcrypt.compare.mockResolvedValue(true);
    await request(app)
      .post("/api/v1/auth/login")
      .send(user);

    await jwt.verify.mockResolvedValue(user);
    const expectedUser = await User.findOne({ name: "customer1" });
    const res = await request(app)
      .get(route(`${expectedUser._id}/cart`))
      .expect(200);
      console.log("HELLO",res.body);
    expect(res.body).toEqual(expect.arrayContaining(expect.any(Array)))
    await bcrypt.compare.mockRestore();
  });

});
