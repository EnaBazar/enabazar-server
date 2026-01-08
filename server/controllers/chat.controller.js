import ChatModel from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { customerId, customerName, from, message } = req.body;

    const chat = new ChatModel({
      customerId,
      customerName,
      from,
      message,
      read: from === "admin" // admin message read=true
    });

    await chat.save();

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerChats = async (req, res) => {
  try {
    const { customerId } = req.params;
    const chats = await ChatModel.find({ customerId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const markChatsAsRead = async (req, res) => {
  const { customerId } = req.params; // এখন সঠিকভাবে customerId পাওয়া যাচ্ছে

  try {
    await Chat.updateMany(
      { customerId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

