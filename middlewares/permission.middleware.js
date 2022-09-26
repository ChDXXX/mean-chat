const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UsersService = require("../modules/users/users.service");
function parseToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      decoded.id = mongoose.mongo.ObjectId(decoded.id);
      req.user = decoded;
    } catch (err) {
      return next();
    }
    return next();
  } else {
    return next();
  }
}

function guard(role) {
  return async (req, res, next) => {
    const user = req.user;
    const user_instance = await UsersService.findUserById(user.id);
    if (!user) {
      return res.status(403).send("Forbidden");
    }
    if (user_instance.role < role) {
      return res.status(403).send("Forbidden");
    }
    next();
  }
}

module.exports = {
  parseToken,
  guard
}