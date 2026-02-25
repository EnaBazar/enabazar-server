import AdminModel from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Admin Login
export async function adminLogin(request, response) {
  try {
    const { email, password } = request.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return response.status(200).json({
      success: true,
      error: false,
      token: token,
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
