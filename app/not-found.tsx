export const runtime = 'edge';

import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Страница не найдена</h1>
      <p className="text-muted-foreground mb-8">
        Запрошенная страница не существует или была перемещена.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        На главную
      </Link>
    </section>
  );
}