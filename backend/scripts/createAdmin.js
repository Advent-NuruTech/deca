import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/fancytech-South Sudan",
    );
    console.log("MongoDB Connected");

    const args = process.argv.slice(2);
    const name = args[0] || "Admin";
    const email = args[1] || "admin@fancytech.com";
    const password = args[2] || "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists with this email");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    console.log("Admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("\nPlease change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
