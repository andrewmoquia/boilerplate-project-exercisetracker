const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema({
  user_id: { type: String },
  description: { type: String },
  duration: { type: Number },
  date: { type: String },
});

const Exercise = model("exercises", exerciseSchema);

module.exports = Exercise;
