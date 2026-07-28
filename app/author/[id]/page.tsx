import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicAuthors, getPublicArticles } from "@/lib/api";
import AuthorPageClient from "./AuthorPageClient";

export async function generateStaticParams() {
  const authors = await getPublicAuthors();
  return authors.map((author) => ({ id: author.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const authors = await getPublicAuthors();
  const author = authors.find((item) => item.id === id);
  if (!author) return {};

  return {
    title: `${author.name} | Author Profile`,
    description: author.bio,
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authors = await getPublicAuthors();
  const author = authors.find((item) => item.id === id);
  if (!author) notFound();

  // Fetch articles from backend API
  const { articles: allArticles } = await getPublicArticles({ limit: 120 });
  const authorArticles = allArticles.filter((art) => art.author.id === author.id);

  return (
    <AuthorPageClient author={author} articles={authorArticles} />
  );
}
