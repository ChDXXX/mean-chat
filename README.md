Assignment 2

S5172215
Zhaocheng Dong
Git 
commit b6ede5079791f25b4cfb55991568344e7d2bfcfb (HEAD -> All, origin/HEAD, origin/All)
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-13 04:35:49

    Update

commit 87a94cd3904d725c637baf69aa1f1e6594639789
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-13 04:31:09

    Update package.json

commit e24fa525e8518c627f7cd330863a8f954912a3f4
Author: ChDXXX <110016254+ChDXXX@users.noreply.github.com>
Date:   2022-10-13 03:49:50

    Delete README.md

commit 9c64cd164e92fb4105a5634e11dd66cf8fe1b02e
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-12 20:46:37

    All

commit ff05bb797aebad479519abb3c2abc6284c211af5 (origin/backend, backend)
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-11 21:10:43

    send message, dispaly messages

commit 15a47e3a1e3d9b1a2bed67a0351bbd07449392f5
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-11 18:32:05

    feat: upload image; use socket to communicate with client

commit 462204a102169b7fb62470641d1528729b15c753
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-11 10:25:15

    feat: channel create, delete; group create delete; user upgrade

commit 339b1390e91e2626cb2f96dcd5aa4c216d2283c8
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-04 21:30:51

    feat:
      Contact list: get user groups and sub channals

commit 8d89480b786f172b017aac4919f93427f928263a
Author: ChDXXX <870565769@qq.com>
Date:   2022-10-03 22:59:46

    feat:
      Users: delete user;
      Groups: create, delete;
      SuperAdmins: creat, upgrade;
      GroupAdmins: create;
      Channels: create, create user, invite, delete, delete user, upgrade

commit 11eb6f968e5cf4a836b4c5d80f8a94fe5e0725c6
Author: ChDXXX <870565769@qq.com>
Date:   2022-09-26 22:39:51

    feat: group create, get

commit 6c83626f4a19d27c5dc863dcf03ac77e44ceba3a
Author: ChDXXX <870565769@qq.com>
Date:   2022-09-24 20:52:55

    feat: user register, login
Description of data structures 
User:
The user base is stored using Json files. Changes to new or existing users can be made directly using MongodDB, which not only makes it easier for the actual owner of the software to operate, but also allows for better management of all user accounts.

Example: Signup and create new
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

Channels:
The channels are physically controlled using Js files, giving certain people certain permissions or managing the channel.

Example: Create and remove
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

Groups:
The group is also based on Js file development and different permissions are given to different roles.

Example: Create and remove
  async deleteGroup(req, res) {
    try {
      const {group_id} = req.params;
      await GroupsService.deleteGroup(group_id);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }

  async createGroup(req, res) {
    try {
      const user = req.user;
      const { group_name } = req.body;
      const new_group = await GroupsService.createGroup(user.id, group_name);
      await UsersService.updateRoles(user.id, UserRole.GROUP_ADMIN, 'group', mongoose.mongo.ObjectId(new_group._id));
      res.status(200).json(new_group);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
}

Description of responsibilities between client and server
Theoretically, the client-server connection is made by a locally built network port, such as http://localhost:4000之类的来实现交互, but since the front-end needs to be linked to the back-end, the main issue is how can the back-end user interaction information be given back in a timely manner at the front-end, so the software is designed here to build a separate server, or or a separate network port for the software to connect users to the server.


A list of routes
1.	Users.routes 

Get the user's ID and login, connect to the user's login privileges.

2.	SuperAdmins.routes

Get the user ID and connect to SuperAdmin's rights management. Get the user ID and connect to SuperAdmin's rights management.

3.	Groups.routes	

Get the group's ID and connect to both the group's users and the group's administrative privileges.

4.	Channels.routes

Get the user ID of the channel, give the administrator a range of functions such as upgrading members, inviting members, and deleting channels at the same time.

5.	GroupsAdmin.routes

Get a user ID and gain administrative access to the group.

Practical applications of Angular
Briefly, the practical application of the code in basic writing or referencing to other pages makes it easier to complete practical product testing based on its powerful functionality and versatility. This is because E2E testing can be used to check that the front-end and back-end connections are working properly. Angular can also help us to control user permissions or group permissions, create channels and other back-end code issues, or to find examples for intensive learning.

