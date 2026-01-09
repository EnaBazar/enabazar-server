import express from "express";
import {
  sendMessage,
  getAllChats,
  getCustomerChats,
  markChatsAsRead,
} from "../controllers/chat.controller.js";
import auth from "../middleware/auth.js";

const chatrouter = express.Router();

// ✅ Protected routes
chatrouter.post("/send", auth, sendMessage);
chatrouter.get("/customer/:customerId", auth, getCustomerChats);
chatrouter.post("/read/:customerId", markChatsAsRead);

// Admin only route (optional)
chatrouter.get("/admin/all",getAllChats);

export default chatrouter;
