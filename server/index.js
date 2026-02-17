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

/* ================== CORS CONFIG ================== */
const allowedOrigins = ["https://goroabazar.com"]; // শুধু এই domain থেকে access
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman, curl ইত্যাদির জন্য
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

// Preflight OPTIONS request handle
app.options("*", cors());

/* ================== HTTP + SOCKET SERVER ================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  path: "/socket.io"
});

app.set("io", io);

/* ================== SOCKET LOGIC ================== */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (customerId) => {
    if (customerId) {
      socket.join(customerId.toString());
      console.log("➡️ Joined room:", customerId);
    }
  });

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
        read: data.from === "admin",
      });

      await chat.save();

      io.to(data.customerId).emit("newMessage", chat);
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================== MIDDLEWARE ================== */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());

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

/* ================== SERVER START ================== */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
