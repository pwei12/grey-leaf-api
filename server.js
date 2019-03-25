const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 8080;
const mongodbUri = "mongodb://localhost/grey-leaf";

mongoose.connect(mongodbUri, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;

db.on('error', err => {
  console.error("Unable to connect to database", err)
});

db.once('open', () => {
  console.log("Connected to database");
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    });
});
