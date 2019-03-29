const mongoose = require("mongoose");
const ObjectId =  mongoose.Schema.Types.ObjectId;

const itemSchema = new mongoose.Schema({
  product: {
    type: [ObjectId],
    ref: "Product"
  },
  quantity: {
    type: Number,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    maxlength: 20,
    index: { unique: true },
    required: true,
    trim: true
  },
  email: {
    type: String,
    index: { unique: true },
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
  cart: [itemSchema]
});

module.exports = mongoose.model("User", userSchema);
