import ChatModel from "../models/chat.model.js";
import mongoose from "mongoose";

// Send message (text/audio)
export const sendMessage = async (req, res) => {
  try {
    const { customerId, customerName, mobile, from, type, message, audio } = req.body;

    if (!customerId || !from || !type) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (type === "text" && (!message || message.trim() === "")) {
      return res.status(400).json({ success: false, message: "Text message required" });
    }

    if (type === "audio" && (!audio || audio.trim() === "")) {
      return res.status(400).json({ success: false, message: "Audio required" });
    }

    const chat = new ChatModel({
      customerId,
      customerName,
      mobile,
    
      from,
      message: type === "text" ? message : "",
      audio: type === "audio" ? audio : "",
      read: from === "admin", // Admin messages are marked read
    });

    await chat.save();

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Send chat error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

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
