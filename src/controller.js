const User = require("./model/user");
const Exercise = require("./model/exercise.js");

const createUser = (req, res) => {
  const { username } = req.body;
  try {
    const user = new User({ username }, (err) => {
      if (err) throw err;
    });

    user.save((err, result) => {
      if (err) throw err;
      res.json({ ...result._doc });
    });
  } catch (err) {
    if (err) throw err;
  }
};

const createExercise = (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  let getDate;

  if (date) {
    getDate = new Date(date).toDateString();
  } else {
    getDate = new Date.now().toDateString();
  }

  try {
    const exercise = new Exercise(
      {
        user_id: _id,
        description,
        duration,
        date: getDate,
      },
      (err) => {
        if (err) throw err;
      }
    );

    exercise.save((err, result) => {
      if (err) throw err;
      res.json({ ...result._doc });
    });
  } catch (err) {
    if (err) throw err;
  }
};

const getUsers = (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (err) throw err;
      res.json([...users]);
    });
  } catch (error) {
    if (err) throw err;
  }
};

module.exports = {
  createUser,
  createExercise,
  getUsers,
};
