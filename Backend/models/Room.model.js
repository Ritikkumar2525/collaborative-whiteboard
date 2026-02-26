import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxParticipants: {
      type: Number,
      default: 10,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);