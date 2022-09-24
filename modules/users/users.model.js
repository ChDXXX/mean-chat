const mongoose = require("mongoose");

const UserRole = {
  'SUPER_ADMIN': 'SUPER_ADMIN',
  'GROUP_ADMIN': 'GROUP_ADMIN',
  'GROUP_ASSISTANT': 'GROUP_ASSISTANT',
  'GENERAL_USER': 'GENERAL_USER'
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
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.GENERAL_USER
  }
});

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
  UserRole
}