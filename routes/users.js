const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const User = require("../models/user");
const router = express.Router();

const isAuthorized = async(req, res, next) => {
    try{
        const {name, email, password} = req.body;
        const loginBy = name||email;
        if(!(loginBy && password)) return res.sendStatus(404);
        const query = name ? {name} : {email};
        const user = await User.findOne(query);
        if(!user) return res.status(400).send("User not found.");
        const verified = await bcrypt.compare(password, user.password);
        if(verified) return next();
        return res.status(401).send("You are not authorized to log in.");
    } catch(err) {
        return res.status(500).send(err);
    }
};

const saltRounds = 10;

router
    .route("/register")
    .post(async(req, res) => {
        try{
            const {name, email, password, confirmedPassword} = req.body;
            if(!(name && email && password && confirmedPassword)) return res.sendStatus(400);
            if(password===confirmedPassword) {
                const hash = await bcrypt.hash(password, saltRounds);
                const userData = {
                    name,
                    email,
                    password: hash
                };
                const newUser = new User(userData);
                await User.init();
                await newUser.save();
                return res.status(202).json(newUser);
            } else {
                return res.send("Please confirm your password again.")
            }
        } catch(err) {
            return res.status(500).send(err);
        };
    });

router
    .route("/login")
    .post(isAuthorized, async(req, res) => {
        try{
            const {name, email, password} = req.body;
            const payload = name ? {name, password} : {email, password} ;
            const token =  await jwt.sign(payload, 'shhhhh');
            return res.cookie("token", token).status(200).send("You are logged in");
        } catch(err) {
            return res.status(500).send(err);
        }
    });

//log out route
//  res.clearCookie(name [, options]) https://expressjs.com/en/4x/api.html#res.cookie

router
    .route("/:id")
    .get(async(req, res) => {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).send("Invalid ID");
            const user = await User.findById(id)
            if(!user) return res.status(404).send("User not found.");
            return res.status(200).json(user);
        } catch(err) {
            return res.status(500).send(err);
        }
    });
module.exports = router;