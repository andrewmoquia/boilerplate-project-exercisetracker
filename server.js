const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./src/router.js");

const mongoURI = process.env.MONGO_URI || "mongouri";

(() => {
  mongoose
    .connect(`${mongoURI}`)
    .then(() => {
      console.log("Successfully connected to the mongo database.");
    })
    .catch((err) => {
      if (err) console.log(err);
    });
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(router);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
