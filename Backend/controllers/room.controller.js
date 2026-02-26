import Room from "../models/Room.model.js";
import { generateRoomId } from "../utils/generateRoomId.js";

/* ===============================
   CREATE ROOM
================================= */
export const createRoom = async (req, res) => {
  try {
    const { name, maxParticipants, isPrivate } = req.body;

    const room = await Room.create({
      name,
      roomId: generateRoomId(),
      host: req.user._id,
      participants: [req.user._id],
      maxParticipants: maxParticipants || 10,
      isPrivate: isPrivate || false,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   JOIN ROOM
================================= */
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.status === "ended") {
      return res.status(400).json({
        message: "Room has ended",
      });
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({
        message: "Room is full",
      });
    }

    if (!room.participants.includes(req.user._id)) {
      room.participants.push(req.user._id);
      await room.save();
    }

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   LEAVE ROOM
================================= */
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.participants = room.participants.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await room.save();

    res.status(200).json({
      message: "Left room successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   END ROOM (HOST ONLY)
================================= */
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only host can end the room",
      });
    }

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    res.status(200).json({
      message: "Room ended successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   GET ROOM DETAILS
================================= */
export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId })
      .populate("host", "name email")
      .populate("participants", "name email");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};