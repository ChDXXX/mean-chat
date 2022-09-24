require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// import modules routes
const UsersRoutes = require("./modules/users/routes");

app.use('/api/users', UsersRoutes);

mongoose.connect(process.env.MONGODB_URI, () => {
  app.listen(PORT, function () {
    console.log(`The backend set up at port ${PORT}`);
  });
})

