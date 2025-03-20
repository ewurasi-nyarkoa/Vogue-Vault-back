import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// console.log(cloudinary.config());
console.log("Cloudinary Ready:", cloudinary.uploader ? "Yes" : "No");
console.log("Cloudinary Uploader:", cloudinary.uploader ? "Exists" : "Not Found");





// // ✅ Use CLOUDINARY_URL directly
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Ensure cloudinary is passed
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});
// ✅ Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
