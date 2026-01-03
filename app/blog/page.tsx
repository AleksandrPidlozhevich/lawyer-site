import { getBlogPosts } from '@/lib/notion';
import { Metadata } from 'next';

export const runtime = 'edge';

import BlogList from '@/components/BlogList';
import { cookies } from 'next/headers';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';
  
  const t = locale === 'en' ? en : locale === 'by' ? by : ru;

  return {
    title: t.blogTitle,
    description: t.blogDescription,
  };
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogList posts={posts} />;
}