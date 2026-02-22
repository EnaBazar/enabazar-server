import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import DbCon from "./libs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

/* ================== ROUTES ================== */
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

const allowedOrigins =
  process.env.MONGODB_URL === "production"
    ? [
        "https://api.goroabazar.com", // 🔴 এখানে তোমার production frontend URL দিবে
      ]
    : [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

/* ================== CORS CONFIG ================== */

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ================== MIDDLEWARE ================== */

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight support

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

/* ================== HTTP SERVER ================== */

const server = http.createServer(app);

/* ================== SOCKET.IO ================== */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
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

      io.to(data.customerId.toString()).emit("newMessage", chat);
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

/* ================== ERROR HANDLER ================== */

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    error: true,
    message: err.message || "Server Error",
  });
});

/* ================== SERVER START ================== */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});