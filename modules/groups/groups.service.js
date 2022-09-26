const {GroupsModel} = require("./groups.model");

class GroupsService {
  constructor() {}

  async getOwnGroups(user_id) {
    return GroupsModel.find({
      creator: user_id
    });
  }

  async createGroup(user_id, group_name) {
    return GroupsModel.create({
      name: group_name,
      creator: user_id
    })
  }


}

module.exports = new GroupsService();