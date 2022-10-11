const {ChannelsService} = require("./channels.service");
const {UsersService} = require("../users/users.service");
const bcrypt = require("bcryptjs");
const {UserRole} = require("../users/users.model");
const mongoose = require("mongoose");
const {GroupsService} = require("../groups/groups.service");

class ChannelsController {
  constructor() {}

  async getUsersOfChannel(req, res) {
    try {
      const { channel_id } = req.params;
      const users = await ChannelsService.getUsersOfChannel(channel_id);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async upgradeUserToAssis(req, res) {
    try {
      const { user_id } = req.body;
      const { channel_id} = req.params;
      await ChannelsService.upgradeToAssis(channel_id, mongoose.mongo.ObjectId(user_id));
      await UsersService.deleteRole(
        mongoose.mongo.ObjectId(user_id),
        'channel',
        mongoose.mongo.ObjectId(channel_id)
      );
      await UsersService.updateRoles(
        mongoose.mongo.ObjectId(user_id),
        UserRole.GROUP_ASSISTANT,
        'channel',
        mongoose.mongo.ObjectId(channel_id)
      )
      res.status(200).send();
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  }

  async removeUserFromChannel(req, res) {
    try {
      const {user_id, channel_id} = req.params;
      await ChannelsService.removeUserFromChannel(channel_id, user_id);
      await UsersService.deleteRole(
        mongoose.mongo.ObjectId(user_id),
        'channel',
        mongoose.mongo.ObjectId(channel_id)
      );
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }

  async inviteUserToChannel(req, res) {
    try {
      const {username} = req.body;
      const { channel_id } = req.params;
      const invitedUser = await UsersService.findUserByName(username);
      if (!invitedUser) {
        return res.status(400).send("Invited user not exists!");
      }

      const userAlreadyIn = await ChannelsService.checkUserInChannel(channel_id, invitedUser._id);
      if (userAlreadyIn) {
        return res.status(409).send("User already in this channel!");
      }

      await ChannelsService.pushUserToChannel(channel_id, mongoose.mongo.ObjectId(invitedUser._id));
      await UsersService.updateRoles(
        mongoose.mongo.ObjectId(invitedUser._id),
        UserRole.GENERAL_USER,
        'channel',
        mongoose.mongo.ObjectId(channel_id)
      );
      res.status(200).send();

    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async createUserOfChannel(req, res) {
    try {
      const user = req.user;
      const {username, email, password} = req.body;
      const { channel_id } = req.params;
      // check user if exist
      let oldUser = await UsersService.findUser(email);
      if (oldUser) {
        // directly add user to channel
        await ChannelsService.pushUserToChannel(channel_id, mongoose.mongo.ObjectId(oldUser._id.toString()));
        return res.status(201).send();
      }

      const hash = await bcrypt.hash(password, 10);
      const roles = [
        {
          role: UserRole.GENERAL_USER,
          channel: mongoose.mongo.ObjectId(channel_id)
        }
      ];
      const creator = user.id;
      const new_user = await UsersService.createUser({
        username,
        hash,
        roles,
        creator,
        email
      });

      await ChannelsService.pushUserToChannel(channel_id, mongoose.mongo.ObjectId(new_user._id));
      res.status(201).send();
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message);
    }

  }

  async createChannel(req, res) {
    try {
      const user = req.user;
      const {name, group} = req.body;
      const group_id = mongoose.mongo.ObjectId(group);
      const channel = await ChannelsService.createChannel(name, user.id, group_id);
      await GroupsService.pushChannel(group_id, mongoose.mongo.ObjectId(channel._id));
      await UsersService.updateRoles(user.id, UserRole.GROUP_ASSISTANT, 'channel', mongoose.mongo.ObjectId(channel._id));
      res.status(201).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeChannel(req, res) {
    try {
      const {channel_id} = req.params;
      await ChannelsService.removeChannel(channel_id);
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  ChannelsController: new ChannelsController()
}