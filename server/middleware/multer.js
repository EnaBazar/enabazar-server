import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "uploads");

// যদি uploads folder না থাকে → তৈরি করো
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;