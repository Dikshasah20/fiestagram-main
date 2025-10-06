// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables


// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// /**
//  * Upload image to Cloudinary
//  * @param {string} filePath - Path of the image file
//  * @returns {Promise<object>} - Uploaded image result from Cloudinary
//  */


// // example multer middleware
// import multer from 'multer';
// export const uploadImage = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: 'images', // Optional: Folder to store images in Cloudinary
//       resource_type: 'image', // Specify the type of upload
//     });
//     return result;
//   } catch (error) {
//     throw new Error(`Image upload failed: ${error.message}`);
//   }
// };

// // Set up multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });



// // example controller
// import { uploadImage } from '../utils/uploadImage.js';
// import multer from 'multer';

// // Set up multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Controller for image upload
// export const uploadImageController = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // The file is available in `req.file.buffer` if you're using multer
//     const filePath = req.file.path; // Modify according to how the file is passed (e.g., buffer or local path)

//     const result = await uploadImage(filePath);
//     res.status(200).json({
//       message: 'Image uploaded successfully',
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     res.status(500).json({ message: `Image upload error: ${error.message}` });
//   }
// };
