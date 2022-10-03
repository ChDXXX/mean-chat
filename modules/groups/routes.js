const express = require("express");
const {GroupsController} = require("./groups.controller");
const {guardOwnedGroup} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.route('')
  .get(GroupsController.getOwnGroups)
  .post(GroupsController.createGroup);

router.route('/:group_id')
  .delete(GroupsController.deleteGroup);


module.exports = router;