import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt; 

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    
    res.cookie("jwt", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


    res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error(" Error in Login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};