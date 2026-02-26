import multer from "multer";
import path from "path";

/* ===========================
   FILE STORAGE CONFIG
=========================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

/* ===========================
   FILE FILTER (SECURITY)
=========================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});