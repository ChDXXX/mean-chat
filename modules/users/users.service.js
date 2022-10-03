const {UserModel} = require("./users.model");
const mongoose = require("mongoose");

class UsersService {
  constructor() {}

  async deleteRole(user_id, belong, belong_id) {
    const user = await UserModel.findById(user_id.toString());
    user.roles = user.roles.filter(role => {
      return role[belong].toString() !== belong_id.toString()
    });
    await user.save();
  }

  async updateRoles(user_id, role, belong, belong_id) {
    const user = await UserModel.findById(user_id.toString());
    const newRole = {
      role,
      [belong]: belong_id
    };
    user.roles.push(newRole);
    await user.save();
  }

  async removeUser(user_id) {
    return UserModel.findByIdAndDelete(user_id);
  }

  async findUserById(user_id) {
    return UserModel.findById(user_id);
  }

  async createUser(user) {
    return UserModel.create(user);
  }

  async findUserByName(username) {
    return UserModel.findOne({username}).lean();
  }

  async findUser(email) {
    return UserModel.findOne({ email }).lean();
  }
}

module.exports = {
  UsersService: new UsersService()
};