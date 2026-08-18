import HeroSection from "@/components/sections/HeroSection";
import { getPublicArticles, getPublicVideos, getHeroSettings, getPublicCategories } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [articlesRes, heroSettings, videos, categories] = await Promise.all([
    getPublicArticles({ limit: 60, sort: 'latest' }).catch(() => ({ articles: [], total: 0, totalPages: 1 })),
    getHeroSettings().catch(() => null),
    getPublicVideos('video').catch(() => []),
    getPublicCategories({ showInHome: true }).catch(() => []),
  ]);

  const articles = (articlesRes && Array.isArray(articlesRes.articles)) ? articlesRes.articles : [];

  return (
    <div>
      {/* Main 3-column portal layout containing all active sections */}
      <HeroSection
        initialArticles={articles}
        initialVideos={Array.isArray(videos) ? videos : []}
        initialHeroSettings={heroSettings}
        initialCategories={Array.isArray(categories) ? categories : []}
      />
    </div>
  );
}
