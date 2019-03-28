const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
jest.mock("bcrypt");

const route = (params = "") => {
  const path = "/api/v1/users";
  return `${path}/${params}`;
};

describe("/users/signup", () => {
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
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongoServer.stop();
  });

  test("[POST] Should add a new user", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "$2b$10$Ow0at",
      confirmedPassword: "$2b$10$Ow0at"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(202);
    const expected = {
      _id: expect.any(String),
      admin: expect.any(Boolean),
      name: newUser.name.toLowerCase(),
      email: newUser.email,
      password: expect.any(String),
      cart: expect.any(Array)
    };
    expect(res.body).toEqual(expect.objectContaining(expected));
    await db.dropCollection("users");
  });

  test("[POST] Should return status code 400 if password doesn't match", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "$2b$10$Ow0at",
      confirmedPassword: "$2b$10$O"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
  });

  test("[POST] Should return status code 403 for user already exist", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "$2b$10$Ow0at",
      confirmedPassword: "$2b$10$Ow0at"
    };
    await User.create(newUser);
    await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(403);
    await db.dropCollection("users");
  });

  test("[POST] Should return status code 400 if name field is missing", async () => {
    const newUser = {
      email: "admin1@email.com",
      password: "r6oi4UGnQWFjMw8ZWynne",
      confirmedPassword: "r6oi4UGnQWFjMw8ZWynne"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
    expect(res.body).toEqual({});
  });

  test("[POST] Should return status code 400 if email field is missing", async () => {
    const newUser = {
      name: "adminName",
      password: "r6oi4UGnQWFjMw8ZWynne",
      confirmedPassword: "r6oi4UGnQWFjMw8ZWynne"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
    expect(res.body).toEqual({});
  });
  // test failing
  test("[POST] Should return status code 400 if password field is missing", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      confirmedPassword: "r6oi4UGnQWFjMw8ZWynne"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
    expect(res.body).toEqual({});
  });

  test("[POST] Should return status code 400 if confirmedPassword field is missing", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "r6oi4UGnQWFjMw8ZWynne"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
    expect(res.body).toEqual({});
  });
});

describe("/users/login", () => {
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

  afterEach(async () => {
    bcrypt.compare.mockRestore();
  });

  test("[POST] Should return status code 200 when a user login by username successfully", async () => {
    bcrypt.compare.mockResolvedValue(true);
    const user = {
      name: "customer2",
      password: "123abg"
    };
    await request(app)
      .post(route("login"))
      .send(user)
      .expect(200);
  });

  test("[POST] Should return status code 200 when a user login by email successfully", async () => {
    bcrypt.compare.mockResolvedValue(true);
    const user = {
      email: "@email.com",
      password: "123abg"
    };
    await request(app)
      .post(route("login"))
      .send(user)
      .expect(200);
  });

  test("[POST] Should return status code 422, 'Invalid user', when user logging in by username is not found", async () => {
    const user = {
      name: "customer5",
      password: "123abg"
    };
    await request(app)
      .post(route("login"))
      .send(user)
      .expect(422);
  });

  test("[POST] Should return status code 422, 'Invalid user', when user logging in by email is not found", async () => {
    const user = {
      email: "sswr@email.com",
      password: "hello789"
    };
    await request(app)
      .post(route("login"))
      .send(user)
      .expect(422);
  });

  test("[POST] Should return status code 401 when a user is not authorized", async () => {
    bcrypt.compare.mockResolvedValue(false);
    const user = {
      name: "customer2",
      password: "123"
    };
    await request(app)
      .post(route("login"))
      .send(user)
      .expect(401);
  });
});

describe.only("/users/:id", () => {
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

  test("[GET] Should return user's details and status code 200 as the token in cookies is verified", async () => {
    const expectedUser = await User.findOne({ name: "customer1" });
    const res = await request(app)
      .get(route(expectedUser._id))
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        admin: false,
        name: expectedUser.name.toLowerCase(),
        email: expectedUser.email,
        password: expect.any(String),
        cart: expect.any(Array)
      })
    );
  });

  test("[GET] Should return status code 403 token is invalid", async () => {});
  test("[GET] Should return status code 400 as user ID is invalid", async () => {});
  test("[GET] Should return status code 404 as user is not found", async () => {});
});
