import { getBlogPostBySlug } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const runtime = 'edge';

import BlogPostContent from '@/components/BlogPostContent';
import { cookies } from 'next/headers';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';
  const t = locale === 'en' ? en : locale === 'by' ? by : ru;

  if (!post) {
    return {
      title: t.articleNotFound,
    };
  }

  return {
    title: `${post.title} | ${t.siteName}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}