/**
 * migrate-images-to-cloudinary.ts
 * --------------------------------
 * Migrates all existing article images stored locally in backend/uploads/
 * to Cloudinary, then updates every Post record in the DB with the new CDN URL.
 *
 * Run:  npx tsx migrate-images-to-cloudinary.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});     

const prisma = new PrismaClient();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

/** Extract just the filename from a local URL like http://localhost:5000/uploads/file-xxx.jpg */
function extractLocalFilename(imageUrl: string): string | null {
  if (!imageUrl) return null;

  // Match both http://host/uploads/filename  and  /uploads/filename  patterns
  const match = imageUrl.match(/\/uploads\/(.+)$/);
  if (match) return match[1];

  return null;
}

/** Return true if this URL is already a Cloudinary URL */
function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

async function uploadFileToCloudinary(filePath: string, publicId: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'gujarat-post',
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return result.secure_url;
}

async function main() {
  console.log('🚀 Starting Cloudinary migration...\n');

  // Fetch ALL posts that have a featuredImage
  const posts = await prisma.post.findMany({
    where: { featuredImage: { not: '' } },
    select: { id: true, slug: true, featuredImage: true },
  });

  console.log(`📋 Total articles with images: ${posts.length}\n`);

  let skipped = 0;
  let uploaded = 0;
  let failed = 0;

  for (const post of posts) {
    const imageUrl = post.featuredImage;

    // Skip if already on Cloudinary
    if (isCloudinaryUrl(imageUrl)) {
      console.log(`  ✅ Already on Cloudinary — skipping: ${post.slug}`);
      skipped++;
      continue;
    }

    // Try to extract local filename
    const filename = extractLocalFilename(imageUrl);

    if (!filename) {
      console.log(`  ⚠️  Cannot resolve local filename for: ${imageUrl} — skipping`);
      skipped++;
      continue;
    }

    const localPath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`  ❌ File not found on disk: ${localPath} — skipping`);
      failed++;
      continue;
    }

    try {
      const publicId = `post-${post.id}`;
      console.log(`  📤 Uploading: ${filename} → gujarat-post/${publicId}`);

      const cloudinaryUrl = await uploadFileToCloudinary(localPath, publicId);

      // Update the DB record
      await prisma.post.update({
        where: { id: post.id },
        data: { featuredImage: cloudinaryUrl },
      });

      console.log(`  ✅ Done: ${cloudinaryUrl}`);
      uploaded++;
    } catch (err: any) {
      console.error(`  ❌ Failed to upload ${filename}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`  Total processed : ${posts.length}`);
  console.log(`  ✅ Uploaded      : ${uploaded}`);
  console.log(`  ⏭️  Skipped       : ${skipped}`);
  console.log(`  ❌ Failed        : ${failed}`);
  console.log('═══════════════════════════════════════\n');

  if (uploaded > 0) {
    console.log('🎉 Migration complete! All images are now served from Cloudinary CDN.');
  } else {
    console.log('ℹ️  Nothing new to migrate.');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Migration failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
