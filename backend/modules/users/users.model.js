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
  roles: {
    default: [],
    type: [{
      role: {
        type: Number,
        enum: Object.values(UserRole),
      },
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
      },
      channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
      }
    }]
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
});

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
  UserRole
}