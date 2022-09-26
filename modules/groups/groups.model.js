const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  GroupsModel: mongoose.model('Group', GroupsSchema)
}