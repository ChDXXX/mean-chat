const mongoose = require("mongoose");

const UserRole = {
  'SUPER_ADMIN': 40,
  'GROUP_ADMIN': 30,
  'GROUP_ASSISTANT': 20,
  'GENERAL_USER': 10
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    enum: Object.values(UserRole),
    default: UserRole.GENERAL_USER
  }
});

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
  UserRole
}