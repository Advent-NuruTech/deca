import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://fancytechintegration.vercel.app",
    "https://www.fancytechintegration.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/fancytech-South Sudan",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => {
  I;
  res.json({ status: "OK", message: "FancyTech South Sudan API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
