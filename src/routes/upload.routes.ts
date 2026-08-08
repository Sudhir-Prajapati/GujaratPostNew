import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// Configure Cloudinary with fallback credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvcffkyjz',
  api_key: process.env.CLOUDINARY_API_KEY || '495845865934762',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ea99jiIs2CS9jRYnPpTmF9PjNIM',
});

// Memory storage keeps file buffer in RAM for direct Cloudinary streaming
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (!file) return cb(null, false);
  const mimetype = (file.mimetype || '').toLowerCase();
  const originalName = (file.originalname || '').toLowerCase();

  const isImageMime = mimetype.startsWith('image/') || mimetype.startsWith('video/') || mimetype === 'application/octet-stream';
  const isImageExt = /\.(jpg|jpeg|png|gif|webp|jfif|pjpeg|avif|svg|bmp|mp4|webm|mov|mkv)$/i.test(originalName);

  if (isImageMime || isImageExt) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image and video files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Increased to 100MB for videos
  },
  fileFilter,
});

router.post('/', (req: any, res: any) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded or file buffer empty.' });
    }

    try {
      // Upload file buffer directly to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gujarat-post',
          resource_type: 'auto',
        },
        (uploadErr: any, result: any) => {
          if (uploadErr) {
            console.error('Cloudinary stream upload error:', uploadErr);
            return res.status(400).json({
              success: false,
              error: uploadErr.message || 'Cloudinary image processing failed.',
            });
          }

          const fileUrl = result?.secure_url || result?.url;
          if (!fileUrl) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve Cloudinary URL.' });
          }

          return res.status(200).json({
            success: true,
            url: fileUrl,
          });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error: any) {
      console.error('Upload route error:', error);
      return res.status(500).json({ success: false, error: error.message || 'File upload failed.' });
    }
  });
});

export default router;
