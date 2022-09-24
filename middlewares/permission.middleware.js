const jwt = require("jsonwebtoken");

function parseToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
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
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(403).send("Forbidden");
    }
    if (user.role !== role) {
      return res.status(403).send("Forbidden");
    }
    next();
  }
}

module.exports = {
  parseToken,
  guard
}