import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Board",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model("Board", boardSchema);