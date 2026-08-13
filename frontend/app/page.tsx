import HeroSection from "@/components/sections/HeroSection";
import { getPublicArticles, getPublicVideos, getHeroSettings, getPublicCategories } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const [{ articles }, heroSettings, videos, categories] = await Promise.all([
    getPublicArticles({ limit: 60 }).catch(() => ({ articles: [] })),
    getHeroSettings().catch(() => null),
    getPublicVideos('video').catch(() => []),
    getPublicCategories({ showInHome: true }).catch(() => []),
  ]);

  return (
    <div>
      {/* Main 3-column portal layout containing all active sections */}
      <HeroSection
        initialArticles={articles || []}
        initialVideos={videos || []}
        initialHeroSettings={heroSettings}
        initialCategories={categories || []}
      />
    </div>
  );
}
