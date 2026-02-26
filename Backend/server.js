console.log("THIS IS THE REAL SERVER FILE");

import "./config/env.js";

import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import initializeSockets from "./sockets/index.js";
import User from "./models/User.model.js";


/* ===============================
   ✅ ADD BOARD ROUTES IMPORT
================================ */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* =====================================================
   ✅ SERVE STATIC UPLOAD FILES
===================================================== */
app.use("/uploads", express.static("uploads"));

/* =====================================================
   ✅ REGISTER BOARD ROUTES
===================================================== */


/* =====================================================
   🔐 SOCKET AUTH MIDDLEWARE
===================================================== */
io.use(async (socket, next) => {
  try {
    console.log("🔎 Incoming socket auth:", socket.handshake.auth);

    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token provided — blocking connection");
      return next(new Error("Authentication required"));
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("❌ Invalid JWT:", err.message);
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("❌ User not found in DB");
      return next(new Error("User not found"));
    }

    console.log("✅ Socket authenticated as:", user.name);

    socket.user = user;

    next();

  } catch (error) {
    console.log("❌ Socket auth crashed:", error.message);
    next(new Error("Authentication failed"));
  }
});

/* =====================================================
   INITIALIZE SOCKET EVENTS
===================================================== */
initializeSockets(io);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server failed:", error);
    process.exit(1);
  }
};

startServer();