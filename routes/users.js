const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const User = require("../models/user");
const router = express.Router();

const isUserValid = async(req, res, next)  => {
    try{
        const {name, email, password} = req.body;
        const loginBy = name||email;
        if(!(loginBy && password)) return res.sendStatus(404);
        const query = name ? {name} : {email};
        const user = await User.findOne(query);
        if(!user) return res.status(400).send("Invalid user.");
        res.locals.user = user;
        res.locals.password = password;
        next();
    } catch(err) {
        return res.status(500).send(err);
    }
};

const isUserAuthorized = async(req, res, next) => {
    try{
        const {password} = req.body;
        if (!res.locals.user) return res.status(422).send("Invalid user.");
        const verified = await bcrypt.compare(password, res.locals.user.password);
        if(!verified) return res.status(401).send("You are not authorized to log in.");
        next();
    } catch(err) {
        return res.status(500).send(err);
    }
};

const saltRounds = 10;

router
    .route("/signup")
    .post(isUserValid, async(req, res) => {
        try{
            if(res.locals.user) return res.status(422).send("User already existed.")
            const {name, email, password, confirmedPassword} = req.body;
            if(!(name && email && password && confirmedPassword)) return res.sendStatus(400);
            if(password===confirmedPassword) {
                const hash = await bcrypt.hash(password, saltRounds);
                if(!hash) return res.sendStatus(500);
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
    .post([isUserValid, isUserAuthorized], async(req, res) => {
        try{
            const {name, email} = req.body;
            const payload = name ? {name} : {email} ;
            const token =  await jwt.sign(payload, 'shhhhh'); //secret string to be stored in which file?
            return res.cookie("token", token).status(200).send("You are logged in."); //cookie opts maxAge, secure, signed?
        } catch(err) {
            return res.status(500).send(err);
        }
    });

router
    .route("/logout")
    .post(isUserValid, async(req, res) => {
        try{
            return res.clearCookie(req.cookies.token).status(200).send("You are logged out.");
        } catch(err) {
            return res.status(500).send(err);
        }
    });

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