const mongoose = require('mongoose');

// схема пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});
userSchema.set('versionKey', false);

module.exports = mongoose.model('user', userSchema);
