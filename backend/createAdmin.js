const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./src/models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@example.com";
    const password = "Admin@123456";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name: "Lucky",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();