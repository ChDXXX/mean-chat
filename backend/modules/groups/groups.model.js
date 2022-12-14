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
  channels: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  createdTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  GroupsModel: mongoose.model('Group', GroupsSchema)
}