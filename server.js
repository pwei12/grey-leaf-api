const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 8080;
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/grey-leaf";

mongoose.connect(mongodbUri, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;

db.on('error', err => {
  console.error("Unable to connect to database", err)
});

db.once('open', () => {
  console.log("Connected to database");
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on Heroku with port number ${port}`);
    } else {
      console.log(`Server is running on http://localhost:${port}`);
    }
    });
});
