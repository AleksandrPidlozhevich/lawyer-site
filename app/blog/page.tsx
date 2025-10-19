"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/notion';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        
        // Проверяем, что получили массив постов
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Ошибка загрузки статей: {error}
        </div>
      </div>
    );
  }

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