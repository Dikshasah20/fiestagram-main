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
//  * Upload video to Cloudinary
//  * @param {string} filePath - Path of the video file
//  * @returns {Promise<object>} - Uploaded video result from Cloudinary
//  */


// // example multer middleware
// import multer from 'multer';
// export const uploadVideo = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: 'videos', // Optional: Folder to store videos in Cloudinary
//       resource_type: 'video', // Specify the type of upload
//     });
//     return result;
//   } catch (error) {
//     throw new Error(`Video upload failed: ${error.message}`);
//   }
// };

// // Set up multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });



// // example controller
// // Controller for video upload
// export const uploadVideoController = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // The file is available in `req.file.path`
//     const filePath = req.file.path; // Modify according to how the file is passed (e.g., buffer or local path)

//     const result = await uploadVideo(filePath);
//     res.status(200).json({
//       message: 'Video uploaded successfully',
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     res.status(500).json({ message: `Video upload error: ${error.message}` });
//   }
// };



