import path from "path";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function checkFileType(req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png"];

  const isMimeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtValid = allowedExtensions.includes(fileExt);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Only Allowed jpg,jpeg and png"), false);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: checkFileType,
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "कोई इमेज फाइल नहीं मिली" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "uploads",
    });

    res.status(200).json({
      message: "Image Uploaded Successfully",
      image: result.secure_url,
    });
  } catch (error) {
    console.error("Error in Image Upload:", error);
    res.status(500).json({
      message: error.message || "Error in Image Upload",
    });
  }
});

export default router;
