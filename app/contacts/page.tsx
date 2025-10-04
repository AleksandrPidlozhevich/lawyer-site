"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';
import { useEffect, useRef } from 'react';

export default function ContactsPage() {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;
    const yandexMapRef = useRef<HTMLDivElement>(null);

    // Load Yandex Map script
    useEffect(() => {
        const loadYandexMap = () => {
            // Check if script is already loaded
            if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
                return;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.async = true;
            script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A45f70f8491c17b27773e49d188921f2295559b10e5f7627b52b75ba3344d159b&width=100%25&height=300&lang=ru_RU&scroll=true';
            
            // Append script to the map container
            if (yandexMapRef.current) {
                yandexMapRef.current.appendChild(script);
            }
        };

        // Load map after component mounts
        const timer = setTimeout(loadYandexMap, 100);
        
        return () => {
            clearTimeout(timer);
            // Clean up script when component unmounts
            const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    const contactItems = [
        {
            icon: Phone,
            label: t.phone,
            value: "+375 (29) 779-88-27",
            href: "tel:+375297798827",
            color: "text-green-600 dark:text-green-400"
        },
        {
            icon: Mail,
            label: t.email,
            value: "lawyer@example.com",
            href: "mailto:lawyer@example.com",
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: MapPin,
            label: t.officeAddress,
            value: t.address,
            href: null,
            color: "text-red-600 dark:text-red-400"
        },
        {
            icon: Clock,
            label: t.workingHours,
            value: t.workingHoursText,
            href: null,
            color: "text-purple-600 dark:text-purple-400"
        }
    ];

    const mapLinks = {
        yandex: "https://yandex.ru/maps/?um=constructor%3A45f70f8491c17b27773e49d188921f2295559b10e5f7627b52b75ba3344d159b&source=constructorLink",
        google: "https://www.google.com/maps/place/Minsk,+Belarus/@53.9006011,27.558972,11z"
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {t.contactsTitle}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t.contactsSubtitle}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-semibold text-foreground mb-8">
                            {t.contactInfo}
                        </h2>
                        
                        <div className="space-y-6">
                            {contactItems.map((item, index) => {
                                const IconComponent = item.icon;
                                const content = (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                        className={`flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300 ${
                                            item.href ? 'cursor-pointer hover:scale-[1.02]' : ''
                                        }`}
                                    >
                                        <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1">
                                                {item.label}
                                            </h3>
                                            <p className="text-muted-foreground whitespace-pre-line">
                                                {item.value}
                                            </p>
                                        </div>
                                        {item.href && (
                                            <ExternalLink size={16} className="text-muted-foreground" />
                                        )}
                                    </motion.div>
                                );

                                return item.href ? (
                                    <a key={index} href={item.href}>
                                        {content}
                                    </a>
                                ) : (
                                    content
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Maps Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Yandex Maps */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">
                                    {t.yandexMaps}
                                </h3>
                                <a
                                    href={mapLinks.yandex}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInYandex}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <div 
                                    ref={yandexMapRef}
                                    className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                                >
                                    <div className="text-muted-foreground">
                                        Загрузка карты...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-foreground">
                                    {t.googleMaps}
                                </h3>
                                <a
                                    href={mapLinks.google}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInGoogle}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d147502.2982524155!2d27.40823!3d53.9006011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35b1e6ad3%3A0xb61b853ddb570d9!2sMinsk%2C%20Belarus!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}