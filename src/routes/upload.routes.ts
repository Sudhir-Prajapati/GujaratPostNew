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

router.post('/', upload.single('file'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  try {
    const localFilePath = req.file.path;
    const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const isPdf = req.file.mimetype === 'application/pdf' || req.file.filename.toLowerCase().endsWith('.pdf');

    // For PDF files, return local server URL and dynamic page count
    if (isPdf) {
      const pageCount = getPdfPageCount(localFilePath);
      // Optional async Cloudinary backup in background
      cloudinary.uploader.upload(localFilePath, { folder: 'gujarat-post', resource_type: 'raw' }).catch(() => {});

      return res.status(200).json({
        success: true,
        data: { url: localUrl, pageCount },
        url: localUrl,
        pageCount,
      });
    }

    // For images, upload to Cloudinary or fallback to localUrl
    try {
      const cloudResult = await cloudinary.uploader.upload(localFilePath, {
        folder: 'gujarat-post',
        resource_type: 'image',
      });

      const finalUrl = cloudResult?.secure_url || cloudResult?.url || localUrl;
      return res.status(200).json({
        success: true,
        data: { url: finalUrl, pageCount: 1 },
        url: finalUrl,
        pageCount: 1,
      });
    } catch (cloudErr) {
      console.warn('Cloudinary upload fallback to local static URL:', cloudErr);
      return res.status(200).json({
        success: true,
        data: { url: localUrl, pageCount: 1 },
        url: localUrl,
        pageCount: 1,
      });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, error: error.message || 'File upload failed.' });
  }
});

export default router;
