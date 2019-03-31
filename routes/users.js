const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const payload = await jwt.verify(token, "shhhhh");
    if (!payload) return res.sendStatus(403);
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};

router.route("/").get(async (req, res) => {
  try {
    const users = await User.find();
    if (users.length < 1) return res.status(404).json("No user found");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router
  .route("/:id")
  .get(verifyToken, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) return res.status(404).json("User not found.");
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        cart: user.cart
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .put(verifyToken, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      const {email, password, confirmedPassword} = req.body;
      if (!user) return res.status(404).json("User not found.");
      if (email) {
        await User.findByIdAndUpdate(id, { email });
      }
      if (password && confirmedPassword) {
        if (password !== confirmedPassword)
        return res.status(400).json("Please confirm your password again.");
        const hash = await bcrypt.hash(password, saltRounds);
        await User.findByIdAndUpdate(id, { password: hash });
      }
      return res.status(202).json({
        id: user.id,
        name: user.name,
        email: user.email,
        cart: user.cart
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  });

router
  .route("/:id/cart")
  .get(verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(202).json(user.cart);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const item = req.body;
      await user.cart.push(item);
      await User.init();
      const userSaved = await user.save();
      return res.status(202).json(userSaved.cart);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .put(verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      const item = user.cart.id(req.body.itemId);
      item.set(req.body.item);
      await User.findByIdAndUpdate(userId, { cart: user.cart });
      return res.status(202).json(user.cart);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      await user.cart.id(req.body.itemId).remove();
      await User.init();
      const userSaved = await user.save();
      return res.status(202).json(userSaved.cart);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

module.exports = router;
