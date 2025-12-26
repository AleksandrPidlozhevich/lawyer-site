import { getBlogPostBySlug } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostContent from '@/components/BlogPostContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Статья не найдена',
    };
  }

  return {
    title: `${post.title} | Адвокат Пидложевич`,
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