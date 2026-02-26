import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },

    sender: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "", // allow empty when file-only message
    },

    /* =========================
       FILE ATTACHMENT
    ========================== */
    file: {
      url: {
        type: String,
      },
      name: {
        type: String,
      },
      type: {
        type: String,
      },
      size: {
        type: Number,
      },
    },

    /* =========================
       MESSAGE FEATURES
    ========================== */
    edited: {
      type: Boolean,
      default: false,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    reactions: [
      {
        user: {
          type: String,
        },
        emoji: {
          type: String,
        },
      },
    ],

    seenBy: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);