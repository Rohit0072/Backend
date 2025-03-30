import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profileRoutes.js"; 
import productRoutes from './routes/products.js';

dotenv.config();

// Connect to Auth Database
connectDB();

// Connect to Product Database
const connectProductDB = async () => {
  try {
    await mongoose.createConnection(process.env.PRODUCT_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    process.exit(1);
  }
};

connectProductDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://ecommerseplatform-rohit0072-rohit0072s-projects.vercel.app", // Deployed frontend URL
  "http://localhost:3000", // Local frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/profile", profileRoutes); 

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
});
