import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import uploadRoute from "./routes/upload.route.js"; // ✅ NEW
import { protect } from "./middleware/auth.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import boardRoutes from "./routes/board.routes.js";

const app = express();

/* ===============================
   GLOBAL MIDDLEWARE
================================= */

// Security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Request logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

/* ===============================
   ✅ SERVE STATIC UPLOADS
================================= */
app.use("/uploads", express.static("uploads"));

/* ===============================
   HEALTH CHECK ROUTE
================================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Collaborative Whiteboard API is running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ===============================
   API ROUTES
================================= */

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/boards", boardRoutes);

/* ===============================
   ✅ FILE UPLOAD ROUTE (PROTECTED)
================================= */
app.use("/api/upload", protect, uploadRoute);

/* ===============================
   PROTECTED TEST ROUTE
================================= */
app.get("/api/users/me", protect, (req, res) => {
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
});

/* ===============================
   404 HANDLER
================================= */
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================= */
app.use(errorHandler);

export default app;