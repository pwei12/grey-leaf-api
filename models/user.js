const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        maxlength: 20,
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
    admin: {
        type: Boolean,
        default: false
    },
    cart: {
        type: [ObjectId], 
        ref: "Product"
    }
});

module.exports = mongoose.model("User", userSchema);