import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// Ensure local uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Extract PDF total page count dynamically from PDF metadata catalog
function getPdfPageCount(filePath: string): number {
  try {
    const data = fs.readFileSync(filePath);
    const text = data.toString('latin1');
    const matches = text.match(/\/Count\s+(\d+)/g);
    if (matches && matches.length > 0) {
      const counts = matches
        .map((m) => parseInt(m.replace(/\/Count\s+/, ''), 10))
        .filter((n) => !isNaN(n) && n > 0 && n < 1000);
      if (counts.length > 0) {
        return Math.max(...counts);
      }
    }
  } catch (err) {
    console.warn('PDF page count calculation error:', err);
  }
  return 24;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvcffkyjz',
  api_key: process.env.CLOUDINARY_API_KEY || '495845865934762',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ea99jiIs2CS9jRYnPpTmF9PjNIM',
});

// Disk storage for 100% reliable local file saving with correct extension
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${cleanBase}_${Date.now()}_${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (!file) return cb(null, false);
  const mimetype = (file.mimetype || '').toLowerCase();
  const originalName = (file.originalname || '').toLowerCase();

  const isAllowedMime =
    mimetype.startsWith('image/') ||
    mimetype.startsWith('video/') ||
    mimetype === 'application/pdf' ||
    mimetype === 'application/x-pdf' ||
    mimetype === 'application/octet-stream';

  const isAllowedExt = /\.(jpg|jpeg|png|gif|webp|jfif|pjpeg|avif|svg|bmp|mp4|webm|mov|mkv|pdf)$/i.test(originalName);

  if (isAllowedMime || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image, video, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max limit
  },
  fileFilter,
});

const handleUpload = (req: any, res: any) => {
  // Support both 'file' and 'image' field names in Multer
  const singleUpload = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]);

  singleUpload(req, res, async (err: any) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
    }

    const uploadedFile = req.file || (req.files && (req.files.file?.[0] || req.files.image?.[0]));

    if (!uploadedFile || !uploadedFile.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded or file buffer empty.' });
    }

    // For images, upload to Cloudinary or fallback to localUrl
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
            data: { url: fileUrl },
          });
        }
      );

      uploadStream.end(uploadedFile.buffer);
    } catch (error: any) {
      console.error('Upload route error:', error);
      return res.status(500).json({ success: false, error: error.message || 'File upload failed.' });
    }
  });
};

router.post('/', handleUpload);
router.post('/image', handleUpload);

export default router;
