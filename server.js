import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profileRoutes.js"; 


dotenv.config();


connectDB();

const app = express();


app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "https://ecommerseplatform-rohit0072-rohit0072s-projects.vercel.app", // Your deployed frontend URL
  "http://localhost:3000", // For local testing
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/profile", profileRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
