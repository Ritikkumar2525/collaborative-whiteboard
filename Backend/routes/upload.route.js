import express from "express";
import { upload } from "../middleware/upload.js";
import Message from "../models/Message.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/file",
  upload.single("file"), // ✅ FIRST
  protect,               // ✅ AFTER multer
  async (req, res) => {
    try {
      const { roomId } = req.body;
      const sender = req.user.name;

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const newMessage = await Message.create({
        roomId,
        sender,
        message: "",
        file: {
          url: `/uploads/${req.file.filename}`,
          name: req.file.originalname,
          type: req.file.mimetype,
          size: req.file.size,
        },
      });

      res.status(201).json(newMessage);

    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({
        message: "File upload failed",
      });
    }
  }
);

export default router;