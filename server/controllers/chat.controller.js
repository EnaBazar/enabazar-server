import ChatModel from "../models/chat.model.js";
import mongoose from "mongoose";


// Send message (text/audio)
import ChatModel from "../models/chat.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// multer memory storage
const upload = multer({ storage: multer.memoryStorage() });
export const audioUploadMiddleware = upload.single("audio");


// ================= SEND MESSAGE =================


// Get customer chats
export const getCustomerChats = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) return res.json({ success: true, chats: [] });

    const chats = await ChatModel.find({ customerId }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get customer chats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark chats as read
export const markChatsAsRead = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) return res.json({ success: true });

    await ChatModel.updateMany({ customerId, read: false }, { $set: { read: true } });
    return res.json({ success: true });
  } catch (error) {
    console.error("Mark chats as read error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all chats (admin)
export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get all chats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
