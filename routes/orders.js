const express = require("express");
const Order = require("../models/order");
const router = express.Router();

router
.route("/orders")
  .get(async (req, res) => {
    try {
      const orders = await Order.findById(req.params.id);
      if (!orders) return res.status(404).send("No order found");
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      await user.cart.set([]);
      await User.init();
      await user.save();

      const order = new Order(req.body);
      await order.save();
      return res.status(201).json(order);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .delete(async (req, res) => {
    try{
    const order = await Order.findByIdAndDelete(req.body.id);
    if(!order) return res.status(404).send("Order not found");
    return res.sendStatus(204);
    } catch (err) {
      return res.status(500).json(err);
    }
  });