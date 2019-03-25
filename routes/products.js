const express = require("express");
const router = express.Router();
const { products } = require("../data/db.json");
const Product = require("../models/product");

router
  .route("/")
  .get((req, res) => {
    return res.json(products);
  })
  .post((req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save(err => {
        if (err) {
            return res.sendStatus(500);
          }
          return res.status(201).json(newProduct);
    });
  });

router
.route("/:id")
.get((req, res) => {
  //change below to usee mongoose
  const [product] = products.filter(product => {
    return req.params.id === product._id;
  });
  if(!product) res.status(404).send(`The product with id ${_id} was not found.`);
  return res.json(product);
});

module.exports = router;
