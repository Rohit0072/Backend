import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    


    const user = new User({ name, email, password: hashedPassword });
    await user.save();


    const savedUser = await User.findOne({ email });

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error(" Error in Registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
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



    res.status(200).json({ success: true, message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

