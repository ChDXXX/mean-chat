const UsersService = require("../users/users.service");
const bcrypt = require("bcryptjs");
const {UserRole} = require("../users/users.model");

class GroupAdminController{
  constructor() {}
  async createGroupAdmin(req, res) {
    try {
      const user = req.user;
      const {username, email, password} = req.body;

      // check user if exist
      let oldUser = await UsersService.findUser(email);
      if (oldUser) {
        return res.status(409).send("User already exist. ");
      }
      oldUser = await UsersService.findUserByName(username);
      if (oldUser) {
        return res.status(409).send("User already exist. Please login.");
      }

      const hash = await bcrypt.hash(password, 10);
      const roles = [
        {
          role: UserRole.GROUP_ADMIN,
        }
      ];
      const creator = user.id;
      await UsersService.createUser({
        username,
        hash,
        roles,
        creator,
        email
      })
      res.status(201).send();
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  GroupAdminController: new GroupAdminController()
}