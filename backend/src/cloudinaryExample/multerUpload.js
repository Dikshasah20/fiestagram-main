// // example uploader route
// import express from 'express';
// import { uploadImageController } from '../controllers/uploadController.js';
// import { uploadVideoController } from '../controllers/uploadController.js';

// const router = express.Router();

// // Assuming multer setup is exported from another file or directly in the controller
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// router.post('/upload/image', upload.single('image'), uploadImageController);
// router.post('/upload/video', upload.single('video'), uploadVideoController);

// export default router;
