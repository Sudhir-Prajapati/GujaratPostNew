import HeroSection from "@/components/sections/HeroSection";
import { getPublicArticles, getPublicVideos } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const { articles } = await getPublicArticles({ limit: 40 });
  const videos = await getPublicVideos();

  return (
    <div>
      {/* Main 3-column portal layout containing all active sections */}
      <HeroSection initialArticles={articles || []} initialVideos={videos || []} />
    </div>
  );
}
