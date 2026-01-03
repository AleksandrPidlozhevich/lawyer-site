import type { Metadata } from "next";
import "./globals.css";

export const runtime = 'edge';

import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/context/LocaleContext";
import { cookies } from 'next/headers';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';
    
    const t = locale === 'en' ? en : locale === 'by' ? by : ru;

    return {
        title: t.metaTitle,
        description: t.metaDescription,
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru';

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className="antialiased font-sans transition-colors flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LocaleProvider>
                <Header />
                <main className="container mx-auto p-6 flex-1">{children}</main>
                <Footer />
            </LocaleProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
