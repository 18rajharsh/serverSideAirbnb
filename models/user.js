const mongoose = require("mongoose");
const userSchema = mongoose.Schema({

  firstName: {
    type: String,
    required: [true, 'First name is required']
  },

  lastName: {
    type: String
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },

  password: {
    type: String,
    required: [true, 'Password is required']
  },

  userMode: {
    type: String,
    enum: ['Guest','Admin'],
    default: 'Guest'
  },

  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
  
});

module.exports = mongoose.model("User", userSchema);
