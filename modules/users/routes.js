const express = require('express');
const UsersController = require("./users.controller");

const router = express.Router();

router.post("/signup", UsersController.signUp);
router.post("/signin", UsersController.signIn);
router.delete('/:user_id', UsersController.removeUser);

module.exports = router;
