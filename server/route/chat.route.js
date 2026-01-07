import express from "express";
import { sendMessage, getCustomerChats, getAllChats } from "../controllers/chat.controller.js";

const chatrouter = express.Router();

// Customer sends message
chatrouter.post("/send", sendMessage);

// Customer gets own chat
chatrouter.get("/customer/:customerId", getCustomerChats);

// Admin gets all chats
chatrouter.get("/admin/all", getAllChats);

export default chatrouter;
