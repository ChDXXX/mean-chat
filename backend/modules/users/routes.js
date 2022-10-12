const express = require('express');
const UsersController = require("./users.controller");
const {parseToken} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.post("/signup", UsersController.signUp);
router.post("/signin", UsersController.signIn);
router.get('/profile', parseToken, UsersController.getUserProfile);
router.get('/:user_id', UsersController.getUserById);
router.delete('/:user_id', UsersController.removeUser);

module.exports = router;
