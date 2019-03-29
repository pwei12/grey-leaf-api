const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const isUserAlreadyExist = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const loginBy = name || email;
    if (!(loginBy && password)) return res.sendStatus(404);
    const query = name ? { name } : { email };
    const user = await User.findOne(query);
    res.locals.user = user;
    res.locals.password = password;
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};

const isUserAuthorized = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!res.locals.user) return res.status(422).json("Invalid user.");
    const verified = await bcrypt.compare(password, res.locals.user.password);
    if (!verified)
      return res.status(401).json("You are not authorized to log in.");
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};

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

const saltRounds = 10;

router.route("/signup").post(isUserAlreadyExist, async (req, res) => {
  try {
    if (res.locals.user) return res.status(403).json("User already exist.");
    const { name, email, password, confirmedPassword } = req.body;
    if (!(name && email && password && confirmedPassword))
      return res.status(400).json("Missing field");
    if (password === confirmedPassword) {
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) return res.sendStatus(500);
      const userData = {
        name,
        email,
        password: hash
      };
      const newUser = new User(userData);
      await User.init();
      await newUser.save();
      const userSaved = await User.findOne({ name });
      return res.status(202).json(userSaved);
    } else {
      return res.status(400).json("Please confirm your password again.");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router
  .route("/login")
  .post([isUserAlreadyExist, isUserAuthorized], async (req, res) => {
    try {
      const { name, email } = req.body;
      const payload = name ? { name } : { email };
      const token = await jwt.sign(payload, "shhhhh"); //secret string to be stored in which file?
      const { _id: id } = await User.findOne(payload);
      return res
        .cookie("token", token) 
        .status(200)
        .json(id);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

router.route("/:id/logout").post(verifyToken, async (req, res) => {
  try {
    const token = req.cookies.token;
    return res
      .clearCookie(token)
      .status(200)
      .json("You are logged out.");
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/:id").get(verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json("User not found.");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router
.route("/:id/cart")
.post(verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    const item = req.body;
    await user.cart.push(item);
    await User.init();
    await user.save();
    const userSaved = await User.findById(id);
    return res.status(202).json(userSaved);
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
