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
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 't6pf4kyu',
  api_key: process.env.CLOUDINARY_API_KEY || '683952475537554',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SeCrA1OZ6g7oqKLPEfBFZ9L8XvY',
});

// Disk storage for 100% reliable file saving before Cloudinary stream upload
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${cleanBase}_${Date.now()}_${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, uniqueName);
  },
});

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
  storage: diskStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max limit
  },
  fileFilter,
});

const handleUpload = (req: any, res: any) => {
  // Support 'file', 'image', 'video', 'pdf', 'photo', and 'avatar' field names
  const singleUpload = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]);

  singleUpload(req, res, async (err: any) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
    }

    const uploadedFile =
      req.file ||
      (req.files &&
        (req.files.file?.[0] ||
          req.files.image?.[0] ||
          req.files.video?.[0] ||
          req.files.pdf?.[0] ||
          req.files.photo?.[0] ||
          req.files.avatar?.[0]));

    if (!uploadedFile) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const filePath = uploadedFile.path;
    const isPdf = uploadedFile.originalname?.toLowerCase().endsWith('.pdf') || uploadedFile.mimetype?.includes('pdf');
    const totalPages = isPdf && filePath ? getPdfPageCount(filePath) : undefined;

    try {
      // Determine resource_type for Cloudinary ('image', 'video', or 'auto')
      let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
      if (uploadedFile.mimetype?.startsWith('image/')) resourceType = 'image';
      else if (uploadedFile.mimetype?.startsWith('video/')) resourceType = 'video';
      else if (isPdf) resourceType = 'auto';

      console.log(`📤 Uploading to Cloudinary [${uploadedFile.originalname}] resourceType=${resourceType}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'gujarat-post',
        resource_type: resourceType,
      });

      const fileUrl = result.secure_url || result.url;
      console.log(`✅ Cloudinary Upload Success: ${fileUrl}`);

      // Clean up temporary local file if uploaded to Cloudinary
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }

      return res.status(200).json({
        success: true,
        url: fileUrl,
        data: {
          url: fileUrl,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          totalPages,
        },
      });
    } catch (cloudinaryErr: any) {
      console.error('⚠️ Cloudinary Upload Error, falling back to local URL:', cloudinaryErr?.message || cloudinaryErr);

      // Fallback: Return local upload URL if Cloudinary fails
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      const localUrl = `${protocol}://${host}/uploads/${uploadedFile.filename}`;

      return res.status(200).json({
        success: true,
        url: localUrl,
        data: {
          url: localUrl,
          totalPages,
        },
      });
    }
  });
};

router.post('/', handleUpload);
router.post('/image', handleUpload);
router.post('/video', handleUpload);

export default router;
