"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';
import { useMemo } from 'react';

export default function ContactsPage() {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;
    const contactItems = useMemo(() => [
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
    ], [t]);

    const mapLinks = useMemo(() => ({
        yandex: "https://yandex.by/maps/org/advokat_pidlozhevich_nikolay_yevstafyevich/235297475101/?utm_medium=mapframe&utm_source=maps",
        google: "https://www.google.com/maps/place/Bronevoi+6,+Minsk,+Minskaja+voblas%C4%87,+Belarus/@53.90476544152037,27.579465151655672,20z"
    }), []);

    const animationVariants = {
        header: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } },
        contactInfo: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2, duration: 0.6 } },
        maps: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4, duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <motion.div
                {...animationVariants.header}
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
                    <motion.div {...animationVariants.contactInfo}>
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
                                    <a key={index} href={item.href} aria-label={`${item.label}: ${item.value}`}>
                                        {content}
                                    </a>
                                ) : (
                                    content
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Maps Section */}
                    <motion.div {...animationVariants.maps} className="space-y-8">
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
                                    aria-label={t.openInYandex}
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInYandex}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <iframe 
                                    src="https://yandex.by/map-widget/v1/?ll=27.579988%2C53.904926&mode=poi&poi%5Bpoint%5D=27.579742%2C53.904936&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D235297475101&z=17" 
                                    width="100%" 
                                    height="300" 
                                    frameBorder="0" 
                                    allowFullScreen={true} 
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    title={`${t.yandexMaps} - ${t.officeAddress}`}
                                />
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
                                    aria-label={t.openInGoogle}
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t.openInGoogle}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d329.7959371992532!2d27.579465151655672!3d53.90476544152037!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfb9e9d2989f%3A0xde397e96fc7bc989!2sBronevoi%206%2C%20Minsk%2C%20Minskaja%20voblas%C4%87%2C%20Belarus!5e0!3m2!1sen!2spl!4v1759661693259!5m2!1sen!2spl"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Карта - местоположение офиса"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}