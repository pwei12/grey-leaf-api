const express = require("express");
const app = express();

const products = require("./routes/products");
// const users = require("./routes/users");
// const login = require("./routes/login");
// const index = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

app.use("/api/v1/products", products);
// app.use("/login/users", users);
// app.use("/login", login);
// app.use("/", index);

module.exports = app;
