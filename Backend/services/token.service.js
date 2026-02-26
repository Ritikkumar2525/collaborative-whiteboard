console.log("JWT_SECRET:", process.env.JWT_SECRET);
import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,   // 🔥 ADD THIS
      email: user.email, // optional but good
      role: user.role    // optional (future RBAC)
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};