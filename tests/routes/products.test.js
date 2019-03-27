const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const Product = require("../../models/product");

const route = (params = "") => {
  const path = "/api/v1/products";
  return `${path}/${params}`;
};

describe("/api/v1/products", () => {
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

  beforeEach(async () => {
    await Product.insertMany([
      {
        name: "Red Flower Soap",
        price: 2.99,
        imageUrl:
          "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        inCart: true,
        bestSeller: false
      },
      {
        name: "Red Rose Soap",
        price: 3.9,
        imageUrl:
        "https://images.unsplash.com/photo-1547793549-70faf88838c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description:
        "red rose petals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        inCart: false,
        bestSeller: false
      },
      {
        name: "Colour Bar Soap",
        price: 25.0,
        imageUrl:
        "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description:
          "assorted-color bar soap lot on white surface. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        inCart: false,
        bestSeller: true
      }
    ]);
  });

  afterEach(async () => {
    await db.dropCollection("products");
  });

  test("[GET] Should get all products, return status code 200", async() => {
    const expectedProducts = await Product.find();
    const res = await request(app)
      .get(route())
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const products = res.body;
    expect(products.length).toBe(expectedProducts.length);
    const productNamesReceived = products.map(product => product.name);
    const productNamesExpected = expectedProducts.map(product => product.name);
    expect(productNamesReceived).toEqual(expect.arrayContaining(productNamesExpected));
  });
  
  
  test("[GET] Should get no product, return status code 404", async() => {

  });

  test("[GET] Should return status code 500, Internal Server Error", async() => {

  });

  test("[POST] Should create a new product, return status code 201", async() => {
    const newProduct = {
      name: "ABC Soap",
      price: 2.10,
      imageUrl:
      "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      inCart: false,
      bestSeller: true
    }
    const res = await request(app)
      .post(route())
      .send(newProduct)
      .expect(201);
      expect(res.body).toEqual(expect.objectContaining({
        _id: expect.any(String),
        name: newProduct.name, //expect.any(String),
        price: newProduct.price, //expect.any(Number),
        url: newProduct.imageUrl, //expect.any(String),
        d: newProduct.description, //expect.any(String),
        inC: newProduct.inCart, //expect.any(Boolean),
        bs: newProduct.bestSeller //expect.any(Boolean)
      }));

  });

  test("[POST] Should be unable to create a new product, return status code 503", async() => {

  });

  test("[POST] Should return status code 500 for internal server error", async() => {

  });
});

describe("/api/v1/products/:id", () => {
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

  beforeEach(async () => {
    await Product.insertMany([
      {
        name: "Red Flower Soap",
        price: 2.99,
        imageUrl:
          "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        inCart: true,
        bestSeller: false
      },
      {
        name: "Red Rose Soap",
        price: 3.9,
        imageUrl:
        "https://images.unsplash.com/photo-1547793549-70faf88838c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description:
        "red rose petals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        inCart: false,
        bestSeller: false
      },
      {
        name: "Colour Bar Soap",
        price: 25.0,
        imageUrl:
        "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description:
          "assorted-color bar soap lot on white surface. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        inCart: false,
        bestSeller: true
      }
    ]);
  });

  afterEach(async () => {
    await db.dropCollection("products");
  });

  test("[GET] Should get the product with valid ID, return status code 200", async() => {
    const {_id:id, price, url, d, inC, bs} = await Product.findOne({name: "Red Flower Soap"});
    const res = await request(app)
    .get(route(id))
    .expect(200);
    
    expect(res.body).toEqual(expect.objectContaining({
      _id: expect.any(String),
      name: "Red Flower Soap", //expect.any(String),
      price: price, //expect.any(Number),
      url: url, //expect.any(String),
      d: d, //expect.any(String),
      inC: inC, //expect.any(Boolean),
      bs: bs, //expect.any(Boolean)
    }));
  });

  test("[GET] Should return status code 400 for invalid product ID", async() => {
    const id = 1;
    await request(app)
      .get(route(id))
      .expect(400);
  });

  test("[GET] Should return status code 404 for product with valid ID but not found", async() => {
    const id = "5c9aedbd62661547d4bc9300";
    await request(app)
        .get(route(id))
        .expect(404);
  });

  test("[GET] Should return status code 500 for internal server error", async() => {

  });

  test("[PUT] Should udpate a product details with valid ID, return status code 202", async() => {
    const {_id: id} = await Product.findOne({name: "Red Rose Soap"});
    const res = await request(app)
      .put(route(id))
      .send({
        name: "Red Rose Soap",
        price: 5.00,
        imageUrl:
        "https://images.unsplash.com/photo-1547793549-70faf88838c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
        description:
        "red rose petals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        inCart: false,
        bestSeller: false
      })
      .expect(202);

      expect(res.body).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: "Red Rose Soap",
          price: 5.00,
          url: expect.any(String),
          d: expect.any(String),
          inC: expect.any(Boolean),
          bs: expect.any(Boolean)
        })
      );
  });

  test("[PUT] Should not modify a product details with invalid product ID, return status code 400", async() => {

  });

  test("[PUT] Should return status code 404 for product with valid ID but not found", async() => {

  });
  test("[PUT] Should return status code 500 for internal server error", async() => {

  });
  
  test("[DELETE] Should remove a product with valid ID, return status code 202", async() => {
    const {_id: id} = await Product.findOne({name: "Colour Bar Soap"});
    await request(app)
    .delete(route(id))
    .expect(202);

    const product = await Product.findById(id);
    expect(product).toBeNull();
  });

  test("[DELETE] Should not remove a product with invalid product ID, return status code 400", async() => {

  });

  test("[DELETE] Should return status code 404 for product is not found", async() => {

  });

  test("[DELETE] Should return status code 500 for internal server error", async() => {

  });
});
