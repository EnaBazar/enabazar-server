import ChatModel from "../models/chat.model.js";

export async function handleMessage(io, socket) {

  socket.on("sendMessage", async (data) => {
    const chat = new ChatModel({
      visitorId: data.visitorId,
      sender: data.from,
      message: data.text,
      context: data.context || null,
    });

    const saved = await chat.save();

    io.emit("newMessage", saved);
  });

}
