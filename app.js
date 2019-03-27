const express = require("express");
const app = express();

const products = require("./routes/products");
const users = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(async(req, res, next) => {
  await res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/v1/products", products);
app.use("/api/v1/users", users);

module.exports = app;
