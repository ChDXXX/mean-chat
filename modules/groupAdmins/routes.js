const express = require("express");
const {GroupAdminController} = require("./groupAdmin.controller");
const {parseToken} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.post('', parseToken, GroupAdminController.createGroupAdmin);

module.exports = router;