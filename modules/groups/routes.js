const express = require("express");
const GroupsController = require("./groups.controller");
const {parseToken, guard} = require("../../middlewares/permission.middleware");
const {UserRole} = require("../users/users.model");

const router = express.Router();

router.route('')
  .get(GroupsController.getOwnGroups)
  .post(GroupsController.createGroup);


module.exports = router;