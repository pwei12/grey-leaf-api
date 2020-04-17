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
  const path = "/api/v1/auth";
  return `${path}/${params}`;
};

describe("/signup", () => {
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
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await bcrypt.hash.mockRestore();
  });

  test("[POST] Should add a new user", async () => {
    bcrypt.hash.mockResolvedValue("$2b$10$Ow0at");
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "abc123",
      confirmedPassword: "abc123"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(202);
    const userSaved = await User.findOne({ name: newUser.name });
    const expected = { id: `${userSaved._id}` };
    expect(res.body).toEqual(expect.objectContaining(expected));
    await db.dropCollection("users");
  });

  test("[POST] Should return status code 400 if password doesn't match", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      password: "123abc",
      confirmedPassword: "123"
    };
    await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
  });

  test("[POST] Should return status code 403 for user already exist", async () => {
    const user = {
      name: "adminName",
      email: "admin1@email.com",
      password: "$2b$10$Ow0at",
      confirmedPassword: "$2b$10$Ow0at"
    };
    await User.create(user);
    const res = await request(app)
      .post(route("signup"))
      .send(user)
      .expect(403);
    expect(res.body).toBe("User already exist.");
    const savedUser = await User.find();
    expect(savedUser.length).toBe(1);
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
    expect(res.body).toBe("Incomplete field.");
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
    expect(res.body).toBe("Incomplete field.");
  });

  test("[POST] Should return status code 400 if password field is missing", async () => {
    const newUser = {
      name: "adminName",
      email: "admin1@email.com",
      confirmedPassword: "r6oi4UGnQWFjMw8ZfWynne"
    };
    const res = await request(app)
      .post(route("signup"))
      .send(newUser)
      .expect(400);
    expect(res.body).toBe("Incomplete field.");
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
    expect(res.body).toBe("Incomplete field.");
  });
});

describe("/login/user", () => {
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
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await bcrypt.compare.mockRestore();
    await jwt.sign.mockRestore();
  });

  test("[POST] Should return status code 200 when a user login by username successfully", async () => {
    await bcrypt.compare.mockResolvedValue(true);
    await jwt.sign.mockResolvedValue("jwttokenstring");
    const user = {
      name: "customer2",
      password: "123abg"
    };
    await request(app)
      .post(route("login/user"))
      .send(user)
      .expect(200);
  });

  test("[POST] Should return status code 200 when a user login by email successfully", async () => {
    await bcrypt.compare.mockResolvedValue(true);
    await jwt.sign.mockResolvedValue("jwttokenstring");
    const user = {
      email: "abc@email.com",
      password: "hello789"
    };
    await request(app)
      .post(route("login/user"))
      .send(user)
      .expect(200);
  });

  test("[POST] Should return status code 404 when user logging in by username is not found", async () => {
    const user = {
      name: "customer5",
      password: "123abg"
    };
    await request(app)
      .post(route("login/user"))
      .send(user)
      .expect(404);
  });

  test("[POST] Should return status code 404 when user logging in by email is not found", async () => {
    const user = {
      email: "s@email.com",
      password: "hello789"
    };
    await request(app)
      .post(route("login/user"))
      .send(user)
      .expect(404);
  });

  test("[POST] Should return status code 401 when a user is not authorized", async () => {
    await bcrypt.compare.mockResolvedValue(false);
    const user = {
      name: "customer2",
      password: "123"
    };
    await request(app)
      .post(route("login/user"))
      .send(user)
      .expect(401);
  });
});

describe("/login/admin", () => {
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
        email: "abc@email.com",
        password: "hello789",
        cart: []
      },
      {
        admin: false,
        name: "wala",
        email: "huhu@email.com",
        password: "hello789",
        cart: []
      }
    ]);
  });

  afterAll(async () => {
    await db.dropCollection("users");
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await bcrypt.compare.mockRestore();
    await jwt.sign.mockRestore();
  });

  test("[POST] Should return status code 200 when admin sign in by email successfully", async () => {
    await bcrypt.compare.mockResolvedValue(true);
    await jwt.sign.mockResolvedValue("jwttokenstring");
    const user = {
      email: "abc@email.com",
      password: "hello789"
    };
    await request(app)
      .post(route("login/admin"))
      .send(user)
      .expect(200);
  });

test("[POST] Should return status code 403 when no user found by email", async () => {
    const user = {
      email: "s@email.com",
      password: "hello789"
    };
    await request(app)
      .post(route("login/admin"))
      .send(user)
      .expect(403);
  });

  test("[POST] Should return status code 403 when non-admin is logging as admin", async () => {
    const user = {
      email: "huhu@email.com",
      password: "hello789",
    };
    await request(app)
      .post(route("login/admin"))
      .send(user)
      .expect(403);
  });

  test("[POST] Should return status code 401 when admin sign in with wrong password", async () => {
    await bcrypt.compare.mockResolvedValue(false);
    const user = {
      email: "abc@email.com",
      password: "hello"
    };
    await request(app)
      .post(route("login/admin"))
      .send(user)
      .expect(401);
  });
});

describe("/logout", () => {
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
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jwt.verify.mockRestore();
  });

  test("[POST] Should log out successfully with status code 200 provided the token in the cookies is verified", async () => {
    await bcrypt.compare.mockResolvedValue(true);
    await jwt.sign.mockResolvedValue("jwttokenstring");
    const user = {
      name: "customer2",
      password: "123abg"
    };
    await request(app)
      .post(route("login/user"))
      .send(user);
    await request(app)
      .post(route("logout"))
      .expect(200);
  });
});
