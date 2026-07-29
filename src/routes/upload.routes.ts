import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Cloudinary as multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gujarat-post',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif', 'pjpeg', 'avif', 'svg'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  } as any,
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (!file) return cb(null, false);
  const mimetype = (file.mimetype || '').toLowerCase();
  const originalName = (file.originalname || '').toLowerCase();

  const isImageMime = mimetype.startsWith('image/') || mimetype === 'application/octet-stream';
  const isImageExt = /\.(jpg|jpeg|png|gif|webp|jfif|pjpeg|avif|svg|bmp)$/i.test(originalName);

  if (isImageMime || isImageExt) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPG, PNG, GIF, WEBP, JFIF, AVIF, SVG) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter,
});

router.post('/', (req: any, res: any, next: any) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.error('Multer file upload error:', err);
      return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded.' });
      }

      // Cloudinary returns the public URL in req.file.path or req.file.secure_url
      const fileUrl = (req.file as any).path || (req.file as any).secure_url;

      return res.status(200).json({
        success: true,
        url: fileUrl,
      });
    } catch (error: any) {
      console.error('Upload handler error:', error);
      return res.status(500).json({ success: false, error: error.message || 'File upload failed.' });
    }
  });
});

export default router;
