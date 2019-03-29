const Product = require("./models/product");

const products = [
  {
    name: "Red Flower Soap",
    price: 2.99,
    description:
      "red flower petals on table. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Red Rose Soap",
    price: 3.9,
    description:
      "red rose petals. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1547793549-70faf88838c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: true
  },
  {
    name: "Colour Bar Soap",
    price: 25.0,
    description:
      "assorted-color bar soap lot on white surface. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Assorted Bar Soap",
    price: 9.5,
    description:
      "assorted bar soaps. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1546552768-9e3a94b38a59?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Alphabet Cube",
    price: 18.0,
    description:
      "assorted-color alphabet cube toy lot. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: true
  },
  {
    name: "Soap XYZ",
    price: 5.8,
    description:
      "gray steel faucet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1418754356805-b89082b6965e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Soap Coffee",
    price: 5.0,
    description:
      "Coffee Beans blend paper bag on ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1495881674446-33314d7fb917?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Soap Packs",
    price: 6.9,
    description:
      "assorted-color soap packs. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1526366003456-b6be088cf674?ixlib=rb-1.2.1&q=80&fm=jpg&auto=format&fit=crop&w=500&max-h=330&q=60",
    inCart: false,
    bestSeller: true
  },
  {
    name: "Soap ABC",
    price: 4.6,
    description:
      "embroidery near textile. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1466027449668-27f96b692ba4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjU5NTA2fQ",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Soap JK-L",
    price: 3.6,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumadsg adsle",
    imageUrl:
      "https://images.unsplash.com/photo-1454873019514-eae2f086587a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    inCart: false,
    bestSeller: false
  },
  {
    name: "Soap 9qnfd3",
    price: 42.8,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1542038374755-a93543c5178f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    inCart: false,
    bestSeller: true
  },
  {
    name: "Soap jag&3",
    price: 19.99,
    description:
      "focused photo of a blue ceramic mug. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    imageUrl:
      "https://images.unsplash.com/photo-1549404183-c6ce67f5697c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&max-h=330&q=60",
    inCart: false,
    bestSeller: false
  }
];

const seedProducts = async () => {
  return await Product.insertMany(products);
};

module.exports = seedProducts;
