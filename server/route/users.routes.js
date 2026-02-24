import express from "express";
import axios from "axios";
import usermodel from "../models/User.js";
import bcryptjs from "bcryptjs";

const usersRoutes = express.Router();

// Register + Send OTP
usersRoutes.post("/register", async (req, res) => {
  const { name, mobile, password } = req.body;

  if (!name || !mobile || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  try {
    // Check if user exists
    let user = await usermodel.findOne({ mobile });
    if (user) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save user
    user = new usermodel({
      name,
      mobile,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000 // 5 min
    });
    await user.save();

    // Send OTP via Greenweb
    const message = `আপনার OTP হলো: ${otp}`;
    const url = `https://api.sms.net.bd/sendsms?api_key=Dukm6pPtPttJKR8Zw26O7M1FBpZGp2Vv52adNohx&msg={YOUR_MSG}&to=8801674847446`;
    await axios.get(url);

    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.log("SMS Error:", error.message);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

// Verify OTP
usersRoutes.post("/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ error: true, message: "Mobile and OTP required" });

  const user = await usermodel.findOne({ mobile });
  if (!user) return res.status(404).json({ error: true, message: "User not found" });

  if (user.otp !== parseInt(otp)) return res.status(400).json({ error: true, message: "Invalid OTP" });
  if (user.otpExpires < Date.now()) return res.status(400).json({ error: true, message: "OTP expired" });

  user.verify_mobile = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return res.json({ success: true, message: "Mobile verified successfully" });
});

export default usersRoutes;