const {GroupsModel} = require("./groups.model");
const mongoose = require("mongoose");
const {UsersService} = require("../users/users.service");
const {UserRole, UserModel} = require("../users/users.model");
const {ChannelsModel} = require("../channels/channels.model");
const {GET_CHANNEL_GROUPS_PIPELINE} = require("./pipeline");

class GroupsService {
  constructor() {}

  async getUserGroups(user_id) {
    let groups = [];

    // find groups by channel
    let channels_groups = await UserModel.aggregate(GET_CHANNEL_GROUPS_PIPELINE(user_id));
    // find manage groups
    let manager_groups = await GroupsModel.find({
      creator: user_id
    }).populate('channels');

    for (let i = 0; i < channels_groups.length; i ++) {
      let group = channels_groups[i];
      if (!groups.find(item => {
        return item._id.toString() === group._id.toString()
      })) {
        groups.push(group);
      }
    }

    for (let i = 0; i < manager_groups.length; i ++) {
      let group = manager_groups[i];
      if (!groups.find(item => {
        return item._id.toString() === group._id.toString()
      })) {
        groups.push(group);
      }
    }
    groups.sort((prev, next) => {
      return new Date(next.createdTime).getTime() - new Date(prev.createdTime).getTime();
    })
    return groups;
  }

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