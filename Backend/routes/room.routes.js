import express from "express";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  endRoom,
  getRoomDetails,
} from "../controllers/room.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.post("/join/:roomId", protect, joinRoom);
router.post("/leave/:roomId", protect, leaveRoom);
router.post("/end/:roomId", protect, endRoom);
router.get("/:roomId", protect, getRoomDetails);

export default router;