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

const createExercise = async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  let getDate;

  if (date) {
    getDate = new Date(date);
  } else {
    getDate = new Date(Date.now());
  }

  try {
    User.findById(_id, (err, user) => {
      if (err) throw err;

      const exercise = new Exercise(
        {
          _id,
          username: user.username,
          description,
          duration,
          date: getDate.toDateString(),
        },
        (err) => {
          if (err) throw err;
        }
      );

      exercise.save((err, result) => {
        if (err) throw err;
        const { _id, date, duration, description } = result._doc;
        res.json({
          _id,
          username: user.username,
          date,
          duration,
          description,
        });
      });
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
  } catch (err) {
    if (err) throw err;
  }
};

const getAllLogs = (req, res) => {
  const { id } = req.params;
  const { from, to } = req.query;

  const query = { _id: id };

  if (from && to) {
    const fromDate = from.split("-").map((date) => Number(date));
    const toDate = to.split("-").map((date) => Number(date));
    query.date = {
      $gte: new Date(fromDate[0], fromDate[1], fromDate[2]),
      $lte: new Date(toDate[0], toDate[1], toDate[2]),
    };
  }

  try {
    Exercise.find(query, (err, result) => {
      if (err) throw err;

      console.log({
        _id: id,
        username: result[0].username,
        count: result.length,
        log: [...result],
      });

      res.json({
        _id: id,
        username: result[0].username,
        count: result.length,
        log: [...result],
      });
    });
  } catch (err) {
    if (err) throw err;
  }
};

module.exports = {
  createUser,
  createExercise,
  getUsers,
  getAllLogs,
};
