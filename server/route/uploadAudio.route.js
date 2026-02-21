import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadAudioRoute = express.Router();
const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

uploadAudioRoute.post("/upload/audio", upload.single("audio"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "chat-audio",
    });

    fs.unlinkSync(req.file.path);

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default uploadAudioRoute;
