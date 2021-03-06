const Product = require("./models/product");
const User = require("./models/user");

const products = [
  {
    "name": "Red Flower Soap",
    "price": 2.99,
    "description": "red flower petals on table. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Red Rose Soap",
    "price": 3.90,
    "description": "red rose petals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1547793549-70faf88838c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "Yes"
  },
  {
    "name": "Colour Bar Soap",
    "price": 2.50,
    "description": "assorted-color bar soap lot on white surface. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    "imageUrl": "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Assorted Bar Soap",
    "price": 4.90,
    "description": "assorted bar soaps. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1546552768-9e3a94b38a59?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Alphabet Cube",
    "price": 3.00,
    "description": "assorted-color alphabet cube toy lot. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "Yes"
  },
  {
    "name": "Soap XYZ",
    "price": 5.80,
    "description": "gray steel faucet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    "imageUrl": "https://images.unsplash.com/photo-1418754356805-b89082b6965e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Soap Coffee",
    "price": 5.00,
    "description": "Coffee Beans blend paper bag on ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1495881674446-33314d7fb917?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Soap Packs",
    "price": 4.90,
    "description": "assorted-color soap packs. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    "imageUrl": "https://images.unsplash.com/photo-1526366003456-b6be088cf674?ixlib=rb-1.2.1&q=80&fm=jpg&auto=format&fit=crop&w=500&max-h=330&q=60",
    "bestSeller": "Yes"
  },
  {
    "name": "Soap ABC",
    "price": 4.60,
    "description": "embroidery near textile. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim.",
    "imageUrl": "https://images.unsplash.com/photo-1466027449668-27f96b692ba4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    "bestSeller": "No"
  },
  {
    "name": "Soap JK-L",
    "price": 3.70,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1454873019514-eae2f086587a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "bestSeller": "No"
  },
  {
    "name": "Soap 9qnfd3",
    "price": 4.80,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua.",
    "imageUrl": "https://images.unsplash.com/photo-1542038374755-a93543c5178f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "bestSeller": "Yes"
  },
  {
    "name": "Soap jag&3",
    "price": 3.99,
    "description": "focused photo of a blue ceramic mug. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid.",
    "imageUrl": "https://images.unsplash.com/photo-1549404183-c6ce67f5697c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&max-h=330&q=60",
    "bestSeller": "No"
  }
];

const seedProducts = async () => {
  return await Product.insertMany(products);
};

module.exports = {seedProducts};
