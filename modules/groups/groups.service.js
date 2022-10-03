const {GroupsModel} = require("./groups.model");
const mongoose = require("mongoose");

class GroupsService {
  constructor() {}

  async deleteGroup(group_id) {
    return GroupsModel.findByIdAndDelete(group_id);
  }

  async pushChannel(group_id, channel_id) {
    const group = await GroupsModel.findById(group_id);
    group.channels.push(channel_id);
    await group.save();
  }

  async createGroup(user_id, group_name) {
    return GroupsModel.create({
      name: group_name,
      creator: user_id
    })
  }


}

module.exports = {
  GroupsService: new GroupsService()
};