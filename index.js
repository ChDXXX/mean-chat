require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// import modules routes
const UsersRoutes = require("./modules/users/routes");
const GroupsRoutes = require("./modules/groups/routes");
const SuperAdminRoutes = require("./modules/superAdmins/routes");
const GroupAdminRoutes = require("./modules/groupAdmins/routes");
const ChannelRoutes = require("./modules/channels/routes");
const {parseToken} = require("./middlewares/permission.middleware");
const {SOCKET_MESSAGES} = require("./consts");
const {ChannelsService} = require("./modules/channels/channels.service");
const fileUpload = require('express-fileupload');


app.use(express.static('public'));
app.use(fileUpload());
app.post(`/upload`, (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  file = req.files.file;
  let file_types = file.name.split('.');
  let file_type = file_types[file_types.length - 1];
  let filename = Date.now() + '.' + file_type;
  uploadPath = __dirname + '/public/' + filename;

  // Use the mv() method to place the file somewhere on your server
  file.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.status(200).send({
      filename: filename
    })
  });
})

app.use("/api/channels", ChannelRoutes);
app.use('/api/superadmins', SuperAdminRoutes);
app.use('/api/groupadmins', GroupAdminRoutes);

app.use('/api/users', UsersRoutes);
app.use('/api/groups', parseToken, GroupsRoutes);



const ChannelSockets = new Map();
function addChannel(channel) {
  if (!ChannelSockets.has(channel)) {
    ChannelSockets.set(channel, []);
  }
}
function removeUserFromOldChannel(old_channel, user_id) {
  if (ChannelSockets.has(old_channel)) {
    let channelSockets = ChannelSockets.get(old_channel);
    ChannelSockets.set(old_channel, channelSockets.filter(item => {
      return item.user !== user_id;
    }));
  }

}

function addUserToNewChannel(channel, user_id, socket) {
  let channelSockets = ChannelSockets.get(channel);
  channelSockets.push({
    user: user_id,
    socket
  });
  ChannelSockets.set(channel, channelSockets);
}

io.on('connection', socket => {
  console.log('a user connected');
  // save user token
  let user = null;
  let current_channel = '';

  // client post new message
  socket.on(SOCKET_MESSAGES.POST_MESSAGE, async (message) => {
    message = JSON.parse(message);
    const channel = mongoose.mongo.ObjectId(current_channel);
    message.author = mongoose.mongo.ObjectId(user.id);
    await ChannelsService.createMessage(channel, message);
    // notify all users of this channel
    const messages = await ChannelsService.getMessagesOfChannel(channel);
    const sockets = ChannelSockets.get(current_channel);

    for (let socket of sockets) {
      try {
        socket.socket.emit(SOCKET_MESSAGES.GET_MESSAGES_RES, JSON.stringify(messages));
      } catch (err) {
        console.log('May be some use crash to offline.', err);
      }
    }
  });

  // on client's requests for messages
  socket.on(SOCKET_MESSAGES.GET_MESSAGES, async (channel) => {
    const messages = await ChannelsService.getMessagesOfChannel(channel);
    socket.emit(SOCKET_MESSAGES.GET_MESSAGES_RES, JSON.stringify(messages));
  });

  // on client switch current channel
  socket.on(SOCKET_MESSAGES.SWITCH_CHANNEL, async channel => {
    console.log("User switch current channel...");

    removeUserFromOldChannel(current_channel, user.id);
    current_channel = channel;
    addChannel(channel);

    addUserToNewChannel(channel, user.id, socket);

    const messages = await ChannelsService.getMessagesOfChannel(channel);
    socket.emit(SOCKET_MESSAGES.GET_MESSAGES_RES, JSON.stringify(messages));
  });

  // on client login with token
  socket.on(SOCKET_MESSAGES.SAVE_TOKEN, (token) => {
    console.log(`User sign with token ${token}`)
    user = jwt.verify(token, process.env.JWT_SECRET);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    user = null;
  });

})

mongoose.connect(process.env.MONGODB_URI, () => {
  http.listen(PORT, function () {
    console.log(`The backend set up at port ${PORT}`);
  });
})

