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

  test("[GET] Should get all products, return status code 200", async () => {
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
    expect(productNamesReceived).toEqual(
      expect.arrayContaining(productNamesExpected)
    );
  });

  test("[GET] Should get no product, return status code 404", async () => {
    await Product.deleteMany({})
    const res = await request(app)
      .get(route())
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
      expect(res.body).toBe("No product found")
  });

  test("[POST] Should create a new product, return status code 201", async () => {
    const newProduct = {
      name: "ABC Soap",
      price: 2.1,
      imageUrl:
        "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      inCart: false,
      bestSeller: true
    };
    const res = await request(app)
      .post(route())
      .send(newProduct)
      .expect(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: newProduct.name, //expect.any(String),
        price: newProduct.price, //expect.any(Number),
        url: newProduct.imageUrl, //expect.any(String),
        d: newProduct.description, //expect.any(String),
        inC: newProduct.inCart, //expect.any(Boolean),
        bs: newProduct.bestSeller //expect.any(Boolean)
      })
    );
  });

  test("[POST] Should be unable to create a new product, return status code 500", async () => {
    const productsBeforePost = await Product.find();
    const newProduct = {
      name: "ABC Soap",
      price: 2.1,
      imageUrl:
        "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    };
    await request(app)
      .post(route())
      .send(newProduct)
      .expect(500);
    const productsAfterPost = await Product.find();
    expect(productsBeforePost.length).toBe(productsAfterPost.length);
  });

  test("[DELETE] Should remove a product with valid ID, return status code 204", async () => {
    const { _id: id } = await Product.findOne({ name: "Colour Bar Soap" });
    await request(app)
      .delete(route())
      .set("Accept", "application/json")
      .send({ id })
      .expect(204);

    const product = await Product.findById(id);
    expect(product).toBeNull();
  });

  test("[DELETE] Should not remove any product, return status code 404 as product is not found", async () => {
    const productsBeforeDelete = await Product.find();
    const res = await request(app)
      .delete(route())
      .set("Accept", "application/json")
      .send({ id: "5c9f65aadefa4838580aaaaa" })
      .expect(404);
    const productsAfterDelete = await Product.find();
    expect(productsBeforeDelete.length).toBe(productsAfterDelete.length);
  });

  test("[DELETE] Should not remove any product, return status code 500 as product ID is invalid", async () => {
    const productsBeforeDelete = await Product.find();
    await request(app)
      .delete(route())
      .set("Accept", "application/json")
      .send({ id: "0" })
      .expect(500);

    const productsAfterDelete = await Product.find();
    expect(productsBeforeDelete.length).toBe(productsAfterDelete.length);
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

  test("[GET] Should get the product with valid ID, return status code 200", async () => {
    const { _id: id, price, url, d, inC, bs } = await Product.findOne({
      name: "Red Flower Soap"
    });
    const res = await request(app)
      .get(route(id))
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: "Red Flower Soap",
        price: price, 
        url: url, 
        d: d, 
        inC: inC, 
        bs: bs
      })
    );
  });

  test("[GET] Should return status code 404 as product is not found", async () => {
    const id = "5c9aedbd62661547d4bc9300";
    await request(app)
      .get(route(id))
      .expect(404);
  });

  test("[PUT] Should udpate a product details with valid ID, return status code 202", async () => {
    const { _id: id } = await Product.findOne({ name: "Red Rose Soap" });
    const res = await request(app)
      .put(route(id))
      .send({
        name: "Red Rose Soap",
        price: 5.0,
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
        price: 5.0,
        url: expect.any(String),
        d: expect.any(String),
        inC: expect.any(Boolean),
        bs: expect.any(Boolean)
      })
    );
  });

  test("[PUT] Should not modify a product's details, return status code 404 as product is not found", async () => {
    const productBeforePut = await Product.find();
    const productNamesBeforePut = productBeforePut.map(product => product.name);
    const id = "5c9aedbd62661547d4bc0000";
    await request(app)
      .put(route(id))
      .expect(404);
      const productAfterPut = await Product.find();
      const productNamesAfterPut = productAfterPut.map(product => product.name);
      expect(productNamesAfterPut).toEqual(expect.arrayContaining(productNamesBeforePut));
  });

  test("[PUT] Should not modify a product's details, return status code 500 as product ID is invalid", async () => {
    const productBeforePut = await Product.find();
    const productNamesBeforePut = productBeforePut.map(product => product.name);
    await request(app)
      .put(route(0))
      .expect(500);
    const productAfterPut = await Product.find();
    const productNamesAfterPut = productAfterPut.map(product => product.name);
    expect(productNamesAfterPut).toEqual(expect.arrayContaining(productNamesBeforePut));
  });
});
