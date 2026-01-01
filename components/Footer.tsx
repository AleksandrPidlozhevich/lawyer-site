'use client';

import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export default function Footer() {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    return (
        <footer className="bg-footer text-foreground text-center py-6 mt-10 transition-colors">
            <p>© {new Date().getFullYear()} {t.footerCopyright}</p>
        </footer>
    );
}
