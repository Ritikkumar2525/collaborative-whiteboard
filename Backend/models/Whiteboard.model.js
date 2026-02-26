import mongoose from "mongoose";

const objectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // unique object id
    type: { type: String, required: true }, // pen | rectangle | text

    data: {
      type: Object, // coordinates, width, height, text content etc.
      required: true,
    },

    style: {
      type: Object, // color, strokeWidth, fontSize etc.
      default: {},
    },
  },
  { _id: false }
);

const whiteboardSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },

    objects: {
      type: [objectSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Whiteboard", whiteboardSchema);