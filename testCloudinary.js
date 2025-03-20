// import dotenv from "dotenv";
// import { v2 as cloudinary } from "cloudinary";
// import path from "path";
// import fs from "fs";

// dotenv.config(); // Load .env file

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const testUpload = async () => {
//   try {
//     const filePath = path.join(process.cwd(), "test-image.jpeg"); // Ensure test image exists

//     if (!fs.existsSync(filePath)) {
//       console.error("❌ Test image not found! Place 'test-image.jpg' in thrift-backend folder.");
//       return;
//     }

//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: "thrift-store",
//       use_filename: true,
//       unique_filename: false,
//     });

//     console.log("✅ Upload successful:", result.secure_url);
//   } catch (error) {
//     console.error("❌ Cloudinary upload failed:", error);
//   }
// };

// testUpload();
