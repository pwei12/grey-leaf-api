const mongoose = require("mongoose");
const itemSchema = require("../models/item");

const orderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        unit: String,
        street: String,
        city: String,
        state: String,
        postcode: Number,
        country: String
    },
    items: [itemSchema]
});

module.exports = mongoose.model("Order", orderSchema);