const mongoose = require("mongoose");
const {ChannelsModel} = require("./channels.model");

class ChannelsService {
  constructor() {}

  async createMessage(channel_id, message) {
    return ChannelsModel.findOneAndUpdate({
      _id: mongoose.mongo.ObjectId(channel_id)
    }, {
      $push: {
        messages: message
      }
    })
  }

  async getMessagesOfChannel(channel_id) {
    const channel = await ChannelsModel.findById(channel_id.toString()).populate("messages.author");
    console.log('debugger')
    const messages = channel.messages;
    messages.sort((prev, next) => {
      return new Date(prev.createdTime).getTime() - new Date(next.createdTime).getTime();
    })
    return messages;
  }

  async getUsersOfChannel(channel_id) {
    const channel = await ChannelsModel.findById(channel_id.toString()).populate("users");
    return channel.users;
  }

  async checkUserInChannel(channel_id, user_id) {
    const channel = await ChannelsModel.findById(channel_id);
    return channel.users.some(user => {
      return user.toString() === user_id.toString();
    })
  }

  async pushUserToChannel(channel_id, user_id) {
    const channel = await ChannelsModel.findById(channel_id);
    channel.users.push(user_id);
    await channel.save();
  }

  async removeUserFromChannel(channel_id, user_id) {
    const channel = await ChannelsModel.findById(channel_id);
    channel.users = channel.users.filter(user => {
      return user.toString() !== user_id.toString();
    });
    await channel.save();
  }

  async upgradeToAssis(channel_id, user_id) {
    const channel = await ChannelsModel.findById(channel_id);
    channel.admins.push(user_id);
    await channel.save();
  }

  async removeChannel(channel_id) {
    return ChannelsModel.findByIdAndDelete(channel_id);
  }

  async createChannel(name, creator, group) {
    const admins = [creator];
    const users = creator;
    return ChannelsModel.create({
      name,
      creator,
      group,
      admins,
      users
    })
  }
}

module.exports = {
  ChannelsService: new ChannelsService()
}