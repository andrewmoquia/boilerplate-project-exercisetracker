const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
  username: { type: String }  
});

const User = model("users_freecodecamp", usersSchema);

module.exports = User;
