'use client';

import * as React from 'react';
import {useEffect, useId, useRef, useState} from 'react';
import Link from "next/link";
import {FileTextIcon, GlobeIcon, HomeIcon, MenuIcon, PhoneIcon, ScaleIcon, X} from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/components/ui/navigation-menu';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "@/components/ui/sheet";
import {cn} from '@/lib/utils';
import ThemeToggle from "./ThemeToggle";
import {useLocale} from '@/context/LocaleContext';
import {ru} from '@/locales/ru';
import {en} from '@/locales/en';
import {by} from '@/locales/by';

interface NavItem {
    href: string;
    key: 'home' | 'blog' | 'contact';
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
    {href: "/", key: 'home', icon: HomeIcon},
    {href: "/blog", key: 'blog', icon: FileTextIcon},
    {href: "/contacts", key: 'contact', icon: PhoneIcon},
];

const languages = [
    {value: "ru", label: "Рус"},
    {value: "by", label: "Бел"},
    {value: "en", label: "Eng"},
];

interface HeaderProps {
    isHidden?: boolean;
}

export function Header({ isHidden = false }: HeaderProps) {
    const {locale, setLocale} = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const selectId = useId();

    useEffect(() => {
        const checkWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setIsMobile(width < 768);
            }
        };
        checkWidth();
        const resizeObserver = new ResizeObserver(checkWidth);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Hide the header in the mobile version when isHidden = true
    if (isHidden && isMobile) {
        return null;
    }

    return (
        <header
            ref={containerRef}
            className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6")}
        >
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">

                {/* Left block: logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-colors"
                >
                    <ScaleIcon size={24}/>
                    {/* Mobile version: two words in a line*/}
                    <span className="flex flex-col sm:hidden leading-tight">
                        {t.logo.split(" ").reduce<string[][]>((acc, word, i) => {
                            if (i % 2 === 0) {
                                acc.push([word]);
                            } else {
                                acc[acc.length - 1].push(word);
                            }
                            return acc;
                        }, []).map((pair, idx) => (<span key={idx}>{pair.join(" ")}</span>
                        ))}
                    </span>

                    {/* Desktop version */}
                    <span className="hidden sm:inline">{t.logo}</span>
                </Link>

                <div className="flex items-center gap-4">
                    {!isMobile && (
                        <>
                            <NavigationMenu>
                                <NavigationMenuList className="gap-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavigationMenuItem key={item.href}>
                                                <NavigationMenuLink
                                                    asChild
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    <Link href={item.href}>
                                                        <Icon size={16}/>
                                                        <span>{t[item.key]}</span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        );
                                    })}
                                </NavigationMenuList>
                            </NavigationMenu>

                            <ThemeToggle/>

                            <Select value={locale} onValueChange={(v) => setLocale(v as "ru" | "en" | "by")}>
                                <SelectTrigger
                                    id={`language-${selectId}`}
                                    className="h-8 border-none px-2 shadow-none hover:bg-accent hover:text-accent-foreground"
                                >
                                    <GlobeIcon size={16}/>
                                    <SelectValue className="hidden sm:inline-flex"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {/* Mobile menu */}
                    {isMobile && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                                    <MenuIcon size={20}/>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64 bg-white dark:bg-gray-950 border-l border-border">
                                <SheetHeader className="flex flex-row items-center justify-between">
                                    <SheetTitle>{t.menuTitle}</SheetTitle>
                                    <SheetClose asChild>
                                        <button className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                            <X size={20} />
                                        </button>
                                    </SheetClose>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2 mt-4">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <SheetClose asChild key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    <Icon size={16}/>
                                                    <span>{t[item.key]}</span>
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                    <div className="mt-4 flex flex-col gap-2">
                                        <ThemeToggle/>
                                        <Select value={locale}
                                                onValueChange={(v) => setLocale(v as "ru" | "en" | "by")}>
                                            <SelectTrigger
                                                id={`language-mobile-${selectId}`}
                                                className="h-8 border px-2 shadow-none hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <GlobeIcon size={16}/>
                                                <SelectValue className="ml-2"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>
        </header>
    );
}
