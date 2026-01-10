import ChatModel from "../models/chat.model.js";
import mongoose from "mongoose";

// ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { customerId, customerName,mobile, from, message } = req.body;

    if (!customerId || !from || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const chat = new ChatModel({
      customerId,
      customerName,
      mobile,
      from,
      message,
      read: from === "admin",
    });

    await chat.save();

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Send chat error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get customer chats
export const getCustomerChats = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.json({ success: true, chats: [] });
    }

    const chats = await ChatModel.find({ customerId }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get customer chats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all chats (Admin)
export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get all chats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Mark chats as read
export const markChatsAsRead = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.json({ success: true });
    }

    await ChatModel.updateMany({ customerId, read: false }, { $set: { read: true } });
    return res.json({ success: true });
  } catch (error) {
    console.error("Mark chats as read error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
