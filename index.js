require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
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

mongoose.connect(process.env.MONGODB_URI, () => {
  app.listen(PORT, function () {
    console.log(`The backend set up at port ${PORT}`);
  });
})

