const mongoose = require("mongoose");
const MessageTypes = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
}
const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  messages: {
    default: [],
    type: [
      {
        messageType: {
          type: String,
          enum: Object.values(MessageTypes),
          default: MessageTypes.TEXT
        },
        resourcePath: String,
        message: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdTime: {
          type: Date,
          default: Date.now
        }
      }
    ]
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
  ChannelsModel: mongoose.model("Channel", ChannelSchema),
  MessageTypes
}

