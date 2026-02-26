import express from "express";
import Board from "../models/Board.model.js";
import { v4 as uuid } from "uuid";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===============================
   CREATE BOARD
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const roomId = uuid();

    const board = await Board.create({
      title: "Untitled Board",
      owner: req.user._id,
      roomId,
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   GET USER BOARDS
================================ */
router.get("/", protect, async (req, res) => {
  try {
    const boards = await Board.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   DELETE BOARD
================================ */
router.delete("/:roomId", protect, async (req, res) => {
  try {
    await Board.findOneAndDelete({
      roomId: req.params.roomId,
      owner: req.user._id,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   RENAME BOARD
================================ */
router.put("/:roomId", protect, async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Board.findOneAndUpdate(
      {
        roomId: req.params.roomId,
        owner: req.user._id,
      },
      { title },
      { new: true }
    );

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;