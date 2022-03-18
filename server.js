const express = require("express");
const mySecret = process.env["MONGO_URI"];
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

//Schemas
const userSchema = new Schema({
  username: String,
});

const exerciseSchema = new Schema({
  username: String,
  date: Date,
  duration: Number,
  description: String,
});

const logSchema = new Schema({
  username: String,
  count: Number,
  log: Array,
});

// Models
const User = mongoose.model("users", userSchema);
const Exercise = mongoose.model("exercises", exerciseSchema);
const Log = mongoose.model("logs", logSchema);

// Config
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

// Middlware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Api Endpoints

// Create user account
app.post("/api/users", (req, res) => {
  User.find({ username: req.body.username }, (err, userData) => {
    if (err) {
      console.log("Error with server=> ", err);
    } else {
      if (userData.length === 0) {
        const test = new User({
          _id: req.body.id,
          username: req.body.username,
        });

        test.save((err, data) => {
          if (err) {
            console.log("Error saving data=> ", err);
          } else {
            res.json({
              _id: data.id,
              username: data.username,
            });
          }
        });
      } else {
        res.send("Username already Exists");
      }
    }
  });
});

// Create exercise
app.post("/api/users/:_id/exercises", (req, res) => {
  let idJson = { id: req.params._id };
  let checkedDate = new Date(req.body.date);
  let idToCheck = idJson.id;

  let noDateHandler = () => {
    if (checkedDate instanceof Date && !isNaN(checkedDate)) {
      return checkedDate;
    } else {
      checkedDate = new Date();
    }
  };

  User.findById(idToCheck, (err, data) => {
    noDateHandler(checkedDate);

    if (err) {
      console.log("error with id=> ", err);
    } else {
      const test = new Exercise({
        username: data.username,
        description: req.body.description,
        duration: req.body.duration,
        date: checkedDate.toDateString(),
      });

      test.save((err, data) => {
        if (err) {
          console.log("error saving=> ", err);
        } else {
          console.log("saved exercise successfully");
          res.json({
            _id: idToCheck,
            username: data.username,
            description: data.description,
            duration: data.duration,
            date: data.date.toDateString(),
          });
        }
      });
    }
  });
});

// Get exercise log
app.get("/api/users/:_id/logs", (req, res) => {
  const { from, to, limit } = req.query;
  let idJson = { id: req.params._id };
  let idToCheck = idJson.id;

  // Check ID
  User.findById(idToCheck, (err, data) => {
    var query = {
      username: data.username,
    };

    if (from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from) };
    } else if (to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) };
    } else if (from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    let limitChecker = (limit) => {
      let maxLimit = 100;
      if (limit) {
        return limit;
      } else {
        return maxLimit;
      }
    };

    if (err) {
      console.log("error with ID=> ", err);
    } else {
      Exercise.find(
        query,
        null,
        { limit: limitChecker(+limit) },
        (err, docs) => {
          let loggedArray = [];
          if (err) {
            console.log("error with query=> ", err);
          } else {
            let documents = docs;
            let loggedArray = documents.map((item) => {
              return {
                description: item.description,
                duration: item.duration,
                date: item.date.toDateString(),
              };
            });

            const test = new Log({
              username: data.username,
              count: loggedArray.length,
              log: loggedArray,
            });

            test.save((err, data) => {
              if (err) {
                console.log("error saving exercise=> ", err);
              } else {
                console.log("saved exercise successfully");
                res.json({
                  _id: idToCheck,
                  username: data.username,
                  count: data.count,
                  log: loggedArray,
                });
              }
            });
          }
        }
      );
    }
  });
});

// Get all users
app.get("/api/users", (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.send("No users found.");
    } else {
      res.json(data);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
