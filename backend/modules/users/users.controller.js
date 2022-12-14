 const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {UsersService} = require("./users.service");
const {UserRole} = require("./users.model");
const mongoose = require("mongoose");

class UsersController {
  constructor() {}

  async getUserProfile(req, res) {
    try {
      const {id} = req.user;
      const user = await UsersService.findUserById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getUserById(req, res) {
    try {
      const {user_id} = req.params;
      const user = await UsersService.findUserById(user_id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeUser(req, res) {
    try {
      const {user_id} = req.params;
      await UsersService.removeUser(user_id);
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async signUp(req, res) {
    try {
      const user = req.body;
      let oldUser = await UsersService.findUser(user.email);
      // check user if exist
      if (oldUser) {
        return res.status(409).send("User already exist. Please login.");
      }

      oldUser = await UsersService.findUserByName(user.username);
      if (oldUser) {
        return res.status(409).send("User already exist. Please login.");
      }

      // create new user
      user.hash = await bcrypt.hash(user.password, 10);
      await UsersService.createUser(user);

      res.status(204).send("No Content");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async signIn(req, res) {
    try {
      let oldUser,
        token;
      const {email, password} = req.body;
      // check user if exist
      oldUser = await UsersService.findUser(email);
      if (!oldUser) {
        return res.status(400).send("Invalid Credentials");
      }

      // check password if right
      if (await bcrypt.compare(password, oldUser.hash)) {
        token = jwt.sign({
          email: oldUser.email,
          username: oldUser.username,
          id: oldUser._id
        }, process.env.JWT_SECRET)
      } else {
        return res.status(400).send("Invalid Credentials");
      }
      res.status(200).json({token, ...oldUser});
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  }
}

module.exports = new UsersController();