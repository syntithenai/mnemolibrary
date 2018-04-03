const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  scope: String,
  token: String,
  tmp_password: String
});

module.exports = mongoose.model('User', UserSchema);
