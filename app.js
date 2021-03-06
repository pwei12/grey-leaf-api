const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const products = require("./routes/products");
const users = require("./routes/users");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
let host;
if (process.env.NODE_ENV !== "production") {
  host = "http://localhost:3000";
} else {
  host = "https://grey-leaf.netlify.app";
}
app.use(async (req, res, next) => {
  await res.header("Access-Control-Allow-Origin", host);
  await res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  await res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/products", products);
app.use("/api/v1/users", users);

module.exports = app;
