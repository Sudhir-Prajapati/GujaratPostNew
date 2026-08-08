import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicAuthors, getPublicArticles } from "@/lib/api";
import AuthorPageClient from "./AuthorPageClient";

export async function generateStaticParams() {
  try {
    const authors = await getPublicAuthors();
    return (authors || []).map((author) => ({ id: author.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const authors = await getPublicAuthors();
    const author = authors.find((item) => item.id === id);
    if (!author) return {};

    return {
      title: `${author.name} | Author Profile`,
      description: author.bio || '',
    };
  } catch {
    return {};
  }
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authors = await getPublicAuthors();
  const author = authors.find((item) => item.id === id);
  if (!author) notFound();

  // Fetch articles from backend API safely
  const { articles: allArticles } = await getPublicArticles({ limit: 120 });
  const authorArticles = (allArticles || []).filter((art) => {
    if (!art || !art.author) return false;
    const authorId = typeof art.author === 'string' ? art.author : art.author.id;
    return authorId === author.id;
  });

  return (
    <AuthorPageClient author={author} articles={authorArticles} />
  );
}
