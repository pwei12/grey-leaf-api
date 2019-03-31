const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    d: {
        type: String,
        required: true,
        trim: true,
        alias: "description"
    },
    url: {
        type: String,
        required: true,
        alias: "imageUrl"
    },
    inC: {
        type: Boolean,
        required: true,
        alias: "inCart"
    },
    bs: {
        type: Boolean,
        required: true,
        alias: "bestSeller"
    }
});

module.exports = mongoose.model("Product", productSchema);