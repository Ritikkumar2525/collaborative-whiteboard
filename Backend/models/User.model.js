import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

/* ===============================
   HASH PASSWORD (Mongoose 7+)
================================= */

userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

/* ===============================
   COMPARE PASSWORD METHOD
================================= */

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);