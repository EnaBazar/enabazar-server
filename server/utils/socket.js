io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /* ===== JOIN ROOM ===== */
  socket.on("join", (room) => {
    socket.join(room);
    console.log("Joined room:", room);
  });

  /* ===== SEND MESSAGE ===== */
  socket.on("sendMessage", async (data) => {
    try {
      console.log("Incoming:", data);

      // 🔴 customerId না থাকলে কিছুই কাজ করবে না
      if (!data.customerId) {
        console.log("No customerId");
        return;
      }

      // ✅ DB save (admin + customer দুজনেরই)
      const chat = await chat.create({
        customerId: data.customerId,
        customerName: data.customerName,
        from: data.from,          // "admin" | "customer"
        type: data.type,          // text | audio
        message: data.message || "",
        audio: data.audio || "",
        createdAt: new Date(),
      });

      // ✅ customer এ পাঠাও
      io.to(data.customerId).emit("newMessage", chat);

      // ✅ admin এ পাঠাও
      io.to("admin").emit("newMessage", chat);

      console.log(chat);

    } catch (err) {
      console.error("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

