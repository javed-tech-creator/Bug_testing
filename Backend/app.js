import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import apiRoute from "./routers/modules.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import dbConnection from "./config/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";
import ApiError from "./utils/master/ApiError.js";
import { responseMiddleware } from "./utils/master/ApiResponse.js";
// import { startNotificationWorker } from "./modules/notification/workers/notification.worker.js";
import path from "path";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseMiddleware);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yourdomain.com",
      "http://localhost:5173",
      "https://dss-crm.netlify.app",
      "https://dss-crm.netlify.app",
      "https://512e89c94599.ngrok-free.app",
      "https://9tcwr6rk-5173.inc1.devtunnels.ms",
      "https://dfmr0pxf-5173.inc1.devtunnels.ms",
      "https://55vfm9n3-5173.inc1.devtunnels.ms",
      "https://55vfm9n3-3000.inc1.devtunnels.ms",
      "https://55vfm9n3-3000.inc1.devtunnels.ms/",
      "https://dss-crm.onrender.com",
      "https://dsswebsitebyyash.netlify.app",
      "https://dssup.in",
      "dssup.in"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/api/v1", apiRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const __dirname = path.resolve();
app.use("/public", express.static(path.join(__dirname, "public")));
import favicon from "serve-favicon";
import AppError from "./utils/appError.js";
app.use(favicon(path.join(__dirname, "public", "dss_logo.webp")));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// soket.io
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://yourdomain.com",
      "http://localhost:5173",
      "https://dss-crm.netlify.app",
      "https://dss-crm.netlify.app",
      "https://512e89c94599.ngrok-free.app",
      "https://9tcwr6rk-5173.inc1.devtunnels.ms",
      "https://dfmr0pxf-5173.inc1.devtunnels.ms",
      "https://dss-crm.onrender.com",
    ],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);
  socket.on("joinVendor", (vendorId) => {
    socket.join(vendorId);
    console.log(`Vendor ${vendorId} joined room`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// startNotificationWorker();
server.listen(port, async () => {
  await dbConnection();
  console.log(`✅ Server running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors || null,
      data: err.data || null,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(500).json({
    statusCode: 500,
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
});
