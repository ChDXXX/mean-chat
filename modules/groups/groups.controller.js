const GroupsService = require("./groups.service");

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

  async createGroup(req, res) {
    try {
      const user = req.user;
      const { group_name } = req.body;
      const new_group = await GroupsService.createGroup(user.id, group_name);
      res.status(200).json(new_group);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
}

module.exports = new GroupsController();