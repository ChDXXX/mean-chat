require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {UsersService} = require("./modules/users/users.service");
const {UserRole} = require("./modules/users/users.model");
const superAdmin = {
    username: 'super',
    email: 'super@gmail.com',
    password: '123'
};

async function init() {
    const hash = await bcrypt.hash(superAdmin.password, 10);
    const user = await UsersService.findUserByName("super");
    if (user) {
        console.log("Super admin has been created!");
        return;
    }
    await UsersService.createUser({
        username: superAdmin.username,
        email: superAdmin.email,
        hash: hash,
        roles: [{
            role: UserRole.SUPER_ADMIN
        }]
    });
    console.log("Create super admin successfully!");
}

mongoose.connect(process.env.MONGODB_URI, async () => {
    await init();
    mongoose.disconnect()
})
