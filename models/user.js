const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator(v) {
      return validator.isEmail(v);
    },
  },
  password: {
    type: String,
    minlength: 1,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
