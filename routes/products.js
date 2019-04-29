const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find();
      if (!products.length > 0) return res.status(404).json("No product found");
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const product = new Product(req.body);
      await Product.init();
      await product.save();
      return res.status(201).json(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.body._id);
      if (!product) return res.status(404).send("Product not found");
      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) return res.status(404).send("Product not found");
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true
      });
      if (!product) return res.status(404).send("Product not found");
      return res.status(202).json(product);
    } catch (err) {
      return res.status(500).send(err);
    }
  });

module.exports = router;
