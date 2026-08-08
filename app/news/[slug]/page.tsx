import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/data";
import { getPublicArticleBySlug, getPublicArticles } from "@/lib/api";
import NewsDetailClient from "./NewsDetailClient";

export const revalidate = 300;

export async function generateStaticParams() {
  const { articles } = await getPublicArticles({ limit: 50 });
  return (articles || []).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) return {};
  const url = `/news/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      siteName: "Gujarat Post",
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) notFound();

  // Dynamically fetch related articles matching this article's categorySlug
  const categorySlug = (article.category || '').toLowerCase().replace(/\s+/g, '-');
  const { articles: categoryArticles } = await getPublicArticles({ categorySlug, limit: 12 });
  const { articles: fallbackArticles } = await getPublicArticles({ limit: 12 });

  // Filter out current article and deduplicate
  const related = [...(categoryArticles || []), ...(fallbackArticles || [])]
    .filter((a, idx, self) => a.id !== article.id && self.findIndex((t) => t.id === a.id) === idx)
    .slice(0, 10);

  const { articles: trending } = await getPublicArticles({ isTrending: true, limit: 11 });

  const articleUrl = `${SITE_URL}/news/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    alternativeHeadline: article.titleGu,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Gujarat Post",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/globe.svg`,
      },
    },
    mainEntityOfPage: articleUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <NewsDetailClient article={article} related={related} trending={trending} articleUrl={articleUrl} />
    </>
  );
}
