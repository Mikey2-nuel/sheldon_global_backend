import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const uniqueName = Date.now() + "-" + sanitized;
    cb(null, uniqueName);
  },
});

// File filter (optional: restrict to images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
