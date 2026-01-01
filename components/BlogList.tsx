'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/notion';
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

interface BlogListProps {
    posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    const dateLocale = locale === 'by' ? 'be-BY' : locale === 'en' ? 'en-US' : 'ru-RU';

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t.blog}</h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-600">
                    {t.noPosts}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700">
                            {post.coverImage && (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                            )}

                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                    {post.title}
                                </Link>
                            </h2>

                            {post.excerpt && (
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                                <span>{post.author}</span>
                                <span>{new Date(post.publishedDate).toLocaleDateString(dateLocale)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}