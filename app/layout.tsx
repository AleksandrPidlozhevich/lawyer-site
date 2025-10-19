// app/layout.tsx або globals.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/context/LocaleContext";

export const metadata: Metadata = {
    title: "Адвокат Пидложевич Николай Евстафьевич | Юридическая помощь",
    description: "Запишитесь на консультацию к адвокату Пидложевич.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
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
