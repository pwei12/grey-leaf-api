const mongoose = require("mongoose");
const ObjectId =  mongoose.Schema.Types.ObjectId;

 const itemSchema = new mongoose.Schema({
    product: {
      type: [ObjectId],
      index: { unique: true },
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true
    }
  });

module.exports = itemSchema;
