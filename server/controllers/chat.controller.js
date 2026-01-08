
import Chat from "../models/chat.model.js";

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
  console.log("🔥 READ API HIT", req.params);

  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ success: false });
    }

    const result = await Chat.updateMany(
      {
        customerId: customerId,   // ✅ STRING MATCH
        from: "admin",
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    return res.json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error("MARK READ ERROR 👉", error);
    return res.status(500).json({ success: false });
  }
};


