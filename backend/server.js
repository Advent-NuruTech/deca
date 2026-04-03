import dotenv from "dotenv";
dotenv.config(); // moved to top (good practice)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import downloadRoutes from "./routes/downloadRoutes.js"; // added download route

// Import routes
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration - updated for Sami Ministry
const corsOptions = {
  origin: [
    "http://localhost:3000",
    // Add your production frontend URL later, e.g.:
    // "https://sami-ministry.vercel.app",
    // "https://www.samiministry.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection - updated database name
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/sami-ministry", // changed from fancytech-South Sudan
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/download", downloadRoutes); // added download route

// Health check - updated message
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Sami Ministry API is running" });
});

const PORT = process.env.PORT || 8000; // changed from 5000 to match your .env (8000)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
