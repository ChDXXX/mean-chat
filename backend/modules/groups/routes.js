const express = require("express");
const {GroupsController} = require("./groups.controller");
const {guardOwnedGroup, parseToken} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.route('')
  .get(GroupsController.getGroupsOfUser)
  .post(GroupsController.createGroup);

router.route('/:group_id')
  .delete(GroupsController.deleteGroup);


module.exports = router;