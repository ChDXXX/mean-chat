const {UserModel} = require("./users.model");

class UsersService {
  constructor() {}

  async findUserById(user_id) {
    return UserModel.findById(user_id);
  }

  async createUser(user) {
    return UserModel.create(user);
  }

  async findUser(email) {
    return UserModel.findOne({ email }).lean();
  }
}

module.exports = new UsersService();