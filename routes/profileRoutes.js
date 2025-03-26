import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();


const protect = (req, res, next) => {
  const token = req.cookies.jwt; 

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; 
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


router.get("/", protect, async (req, res) => {
  
    try {
      const user = await User.findById(req.userId).select("-password");

  
      if (!user) {
  
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(" Error fetching profile:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

export default router;
