const {GroupsService} = require("./groups.service");
const {UsersService} = require("../users/users.service");
const {UserRole} = require("../users/users.model");
const mongoose = require("mongoose");

class GroupsController {
  constructor() {}

  async getOwnGroups(req, res) {
    try {
      const user = req.user;
      const groups = await GroupsService.getOwnGroups(user.id);
      res.status(200).json(groups);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }

  async deleteGroup(req, res) {
    try {
      const {group_id} = req.params;
      await GroupsService.deleteGroup(group_id);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }

  async createGroup(req, res) {
    try {
      const user = req.user;
      const { group_name } = req.body;
      const new_group = await GroupsService.createGroup(user.id, group_name);
      await UsersService.updateRoles(user.id, UserRole.GROUP_ADMIN, 'group', mongoose.mongo.ObjectId(new_group._id));
      res.status(200).json(new_group);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  GroupsController: new GroupsController()
};