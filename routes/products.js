const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
// const { products } = require("../data/db.json");
const Product = require("../models/product");

const isIdValid = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) 
  return res.status(400).send("Invalid ID");
  next();
}
router
  .route("/")
  .get((req, res) => {
    Product.find()
    .then(product => {
      if(!product) return res.status(404).send("No product found");
      return res.status(200).json(product);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
  })
  .post((req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save()
    .then(product => {
      return res.status(201).json(product);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
  });

router
.route("/:id")
.get(isIdValid, (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product=> { 
      if(!product) return res.status(404).send("Product is not found");
      return res.status(200).json(product);
    })
    .catch((err)=> {
      return res.status(500).send(err);
    });
})
.put(isIdValid, (req, res) => {
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, {runValidators: true, new:true})
  .then(product => {
    if(!product) return res.status(404).send("Product not found");
    return res.json(product);
  })
  .catch(err => {
    return res.status(500).send(err);
  });
})
.delete(isIdValid, (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
  .then(product => {
    if(!product) return res.status(404).send("Product not found");
    return res.sendStatus(202);
  })
  .catch(err => {
    return res.status(500).send(err);
  });
});

module.exports = router;
