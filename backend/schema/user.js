const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength:30
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength:50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength:50
  },
  password: {
    type: String,
    required: true,
    minLength:6
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  createdAT: {
    type: Date,
    default:Date.now()
  }

})

const User = mongoose.model('User', userSchema);
module.exports = User;