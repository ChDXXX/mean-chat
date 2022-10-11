require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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


app.use("/api/channels", ChannelRoutes);
app.use('/api/superadmins', SuperAdminRoutes);
app.use('/api/groupadmins', GroupAdminRoutes);

app.use('/api/users', UsersRoutes);
app.use('/api/groups', parseToken, GroupsRoutes);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

mongoose.connect(process.env.MONGODB_URI, () => {
  http.listen(PORT, function () {
    console.log(`The backend set up at port ${PORT}`);
  });
})

