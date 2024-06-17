const User = require("../models/User");
require("dotenv").config();

const initAdmin = async () => {
  const username = "admin";
  const password = process.env.INIT_ADMIN_PASSWORD;
  const role = "administrator";

  try {
    let adminUser = await User.findOne({ username });

    if (!adminUser) {
      adminUser = new User({ username, password, role });
      await adminUser.save();

      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    console.error(
      "################ WARNING ! Please check .env files for INIT_ADMIN_PASSWORD and ensure MongoDB is running. ################"
    );
  }
};

module.exports = initAdmin;
