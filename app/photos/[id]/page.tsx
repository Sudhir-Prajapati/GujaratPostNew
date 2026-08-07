import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicGallery, getPublicArticles } from "@/lib/api";
import PhotoDetailClient from "./PhotoDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const photos = await getPublicGallery();
  return photos.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const photos = await getPublicGallery();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return {};

  return {
    title: `${photo.caption} - Photo Gallery`,
    description: `View ${photo.caption} and other latest news photos on Gujarat Post.`,
    openGraph: {
      title: `${photo.caption} - Photo Gallery`,
      description: `View ${photo.caption} and other latest news photos on Gujarat Post.`,
      images: [{ url: photo.src, alt: photo.caption }],
    },
  };
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Fetch photo details from backend API
  const allPhotos = await getPublicGallery();
  const photo = allPhotos.find((p) => p.id === id);
  if (!photo) notFound();

  // 2. Fetch trending articles from backend API
  const { articles: trending } = await getPublicArticles({ isTrending: true, limit: 6 });

  return (
    <PhotoDetailClient
      activeId={id}
      photo={photo}
      allPhotos={allPhotos}
      trending={trending}
    />
  );
}
