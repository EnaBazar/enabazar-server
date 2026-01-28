import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import DbCon from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

// Routes
import AuthRoutes from "./route/auth.routes.js";
import categoryRoutes from "./route/category.route.js";
import productRoutes from "./route/product.route.js";
import cartRoutes from "./route/cart.route.js";
import mylistRoutes from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import bannerV1Routes from "./route/bannerV1.route.js";
import bannerV2Routes from "./route/bannerV2.route.js";
import bannerV3Routes from "./route/bannerV3.route.js";
import blogRoutes from "./route/blog.route.js";
import orderRoutes from "./route/order.route.js";
import homeSlideRoutes from "./route/homeSlide.route.js";
import chatrouter from "./route/chat.routes.js";

dotenv.config();
DbCon();

const PORT = process.env.PORT || 5000;
const app = express();

/* ================== ALLOWED ORIGINS ================== */
const allowedOrigins = [
  "https://goroabazar.com",
  "https://www.goroabazar.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight handler
app.options("*", cors());

app.use(express.json({ limit: "15mb" })); // voice files need bigger limit
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());

/* ================== HTTP + SOCKET SERVER ================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  path: "/socket.io",
});

app.set("io", io);

/* ================== SOCKET LOGIC ================== */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join room by customerId
  socket.on("join", (customerId) => {
    if (customerId) {
      socket.join(customerId.toString());
      console.log("➡️ Joined room:", customerId);
    }
  });

  // Handle sendMessage (text/audio)
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

      // Emit to the specific room
      io.to(data.customerId).emit("newMessage", chat);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================== ROUTES ================== */
app.use("/auth", AuthRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/mylist", mylistRoutes);
app.use("/address", addressRouter);
app.use("/homeSlides", homeSlideRoutes);
app.use("/bannerV1", bannerV1Routes);
app.use("/bannerV2", bannerV2Routes);
app.use("/bannerV3", bannerV3Routes);
app.use("/blog", blogRoutes);
app.use("/order", orderRoutes);
app.use("/chat", chatrouter);

/* ================== HEALTH CHECK ================== */
app.get("/", (req, res) => {
  res.send("🟢 API is running");
});

/* ================== SERVER START ================== */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
