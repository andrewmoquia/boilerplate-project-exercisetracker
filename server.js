const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/model/user.js');
const Exercise = require('./src/model/exercise.js');

const mongoURI = process.env.MONGO_URI || "mongouri";

(() => {
  mongoose
  .connect(`${mongoURI}`)
  .then(() => {
     console.log('Successfully connected to the mongo database.')
  })
  .catch((err) => { if(err) console.log(err); })
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  try {
    const user = new User({ username }, (err) => {
      if(err) throw err;
    });
  
    user.save((err, result) => {
      if(err) throw err;
      res.json({ ...result._doc });
    });
  } catch(err) {
      if(err) throw err;
  }

});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  
  let getDate;

  if(date) {
    getDate = new Date(date).toDateString() ;
  } else {
    getDate = new Date.now().toDateString();
  }

  try {
    const exercise = new Exercise({
      user_id: _id,
      description,
      duration,
      date: getDate
    }, (err) => {
      if(err) throw err;
    });

    exercise.save((err, result) => {
      if(err) throw err;
      res.json({ ...result._doc });
    });
  } catch(err) {
      if(err) throw err;
  }
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, result) => {
    if(err) throw err;
    res.json({...result})
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
