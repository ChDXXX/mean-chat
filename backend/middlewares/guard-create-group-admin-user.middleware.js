const {UserRole} = require("../modules/users/users.model");

const guardCreateGroupAdminUserMiddleware = async (req, res, next) => {
  let roles, isSuperAdmin;
  const user = req.user;
  const user_instance = req.user_instance;
  if (!user) {
    return res.status(403).send("Forbidden");
  }

  roles = user_instance.roles;
  isSuperAdmin = roles.some(item => {
    return item.role === UserRole.SUPER_ADMIN;
  });

  if (!isSuperAdmin) {
    return res.status(403).send('Forbidden');
  }

  next();
}
module.exports = {
  guardCreateGroupAdminUserMiddleware: guardCreateGroupAdminUserMiddleware
}