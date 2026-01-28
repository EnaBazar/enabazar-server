import ChatModel from "../models/chat.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import multer from "multer";

// multer memory storage



cloudinary.config({
     
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true,
});
// Send message (text/audio)
export const sendMessage = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      mobile,
      from,
      type,
      message,
    } = req.body;

    if (!customerId || !from || !type) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // ================= TEXT =================
    if (type === "text") {
      if (!message || message.trim() === "") {
        return res
          .status(400)
          .json({ success: false, message: "Text message required" });
      }

      const chat = await ChatModel.create({
        customerId,
        customerName,
        mobile,
        from,
        type: "text",
        message,
        audio: "",
        read: from === "admin",
      });

      return res.status(200).json({ success: true, chat });
    }

    // ================= AUDIO =================
    if (type === "audio") {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Audio file required" });
      }

      // upload to cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "video", // audio = video
            folder: "chat_audio",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(req.file.buffer);
      });

      const chat = await ChatModel.create({
        customerId,
        customerName,
        mobile,
        from,
        type: "audio",
        message: "",
        audio: uploadResult.secure_url, // ✅ ONLY URL
        read: from === "admin",
      });

      return res.status(200).json({ success: true, chat });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid message type" });
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
