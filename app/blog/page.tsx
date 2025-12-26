import Link from 'next/link';
import { getBlogPosts } from '@/lib/notion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Блог | Адвокат Пидложевич',
  description: 'Полезные статьи и новости юридической практики',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Блог</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-600">
          Статьи не найдены
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              {post.coverImage && (
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              
              {post.excerpt && (
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{post.author}</span>
                <span>{new Date(post.publishedDate).toLocaleDateString('ru-RU')}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}