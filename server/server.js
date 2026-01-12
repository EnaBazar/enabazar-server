import express from "express";
import dotenv from "dotenv";
import DbCon from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

// Routes
import chatrouter from "./route/chat.routes.js";

dotenv.config();
DbCon();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());

// ROUTES
app.use("/chat", chatrouter);

const server = http.createServer(app);

// ===== SOCKET.IO SETUP =====
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // join room by customerId
  socket.on("joinRoom", (customerId) => {
    socket.join(customerId);
    console.log(`Client ${socket.id} joined room ${customerId}`);
  });

  // send message
  socket.on("sendMessage", async (data) => {
    try {
      const ChatModel = (await import("./models/chat.model.js")).default;

      const chat = new ChatModel({
        customerId: data.customerId,
        customerName: data.customerName,
        mobile: data.mobile,
        from: data.from,
        type: data.type,
        message: data.type === "text" ? data.message : "",
        audio: data.type === "audio" ? data.audio : "",
        read: data.from === "admin",
      });

      await chat.save();

      // Emit to this room
      io.to(data.customerId).emit("newMessage", chat);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// LISTEN
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
