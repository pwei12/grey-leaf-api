const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const isUserAlreadyExist = async (username, email) => {
  try {
    const query = username ? { name: username } : { email };
    const user = await User.findOne(query);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const saltRounds = 10;

router.route("/signup").post(async (req, res) => {
  try {
      const {name, email,  password, confirmedPassword} = req.body;
      if(!(name && email && password && confirmedPassword)) return res.status(400).json("Incomplete field.")
    const user = await isUserAlreadyExist(name, email);
    if (user) return res.status(403).json("User already exist.");
    if (password !== confirmedPassword) return res.status(400).json("Please confirm your password again.");
    const hash = await bcrypt.hash(password, saltRounds);
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hash
    };
    const newUser = await new User(userData);
    await User.init();
    await newUser.save();
    return res.status(202).json({id: newUser.id});
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/login").post(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await isUserAlreadyExist(name, email);
    if (!user) return res.status(404).json("Please sign up.");
    const verifiedPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!verifiedPassword)
      return res.status(401).json("Wrong password.");
    const token = await jwt.sign(req.body, "shhhhh");
    return res
      .cookie("token", token)
      .status(200)
      .json(user.cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.route("/logout").post(async (req, res) => {
  try {
    return res
      .clearCookie("token")
      .status(200)
      .json("You are logged out.");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
