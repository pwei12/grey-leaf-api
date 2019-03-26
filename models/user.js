const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        index: {unique: true},
        required: true,
        trim: true,
    },
    email: {
        type: String,
        index: {unique: true},
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer",
        trim: true
    },
    cart: {
        type: [ObjectId], 
        ref: "Product"
    }
});

module.exports = mongoose.model("User", userSchema);