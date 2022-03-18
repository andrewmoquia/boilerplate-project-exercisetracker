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
        const { date, duration, description } = result._doc;
        res.json({
          _id: user._id,
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
  const { from, to, limit } = req.query;

  console.log({ from, to, limit });
  try {
    User.findById(id, async (err, user) => {
      if (err) throw err;
      const exercise = await Exercise.find({
        username: user.username,
        date: { $gte: new Date(from), $lt: new Date(to) },
      }).limit(Number(limit));
      res.json({
        _id: id,
        username: user.username,
        count: exercise.length,
        log: [...exercise],
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
