const UsersService = require("../modules/users/users.service");

const getUserInstanceMiddleware = async (req, res, next) => {
  const user = req.user;
  const user_instance = await UsersService.findUserById(user.id);
  req.user_instance = user_instance;
  next();
}

module.exports = {
  getUserInstanceMiddleware
}