const express = require("express");
const {SuperAdminController} = require("./superAdmin.controller");
const {parseToken} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.post('', parseToken, SuperAdminController.createSuperAdmin);
router.put('/:user_id', SuperAdminController.upgradeSuperAdmin);

module.exports = router;