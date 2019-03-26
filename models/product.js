const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    price: {
        type: Number, //OR https://www.npmjs.com/package/mongoose-float, http://plugins.mongoosejs.io/plugins/double
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
        alias: "imageUrl",
        // validate: { 
        //     validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
        //     message: 'Must be a Valid URL' 
        //   } //OR https://www.npmjs.com/package/mongoose-type-url
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