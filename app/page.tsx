// app/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, CheckCircle } from "lucide-react";
import Image from "next/image";
import CallbackModal from "../components/CallbackModal";
import Waves from "../components/Waves";
import { FlipWords } from "@/components/ui/flip-words"
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export default function Home() {
    const [showCallbackModal, setShowCallbackModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const achievements = [
        {
            icon: Trophy,
            value: "95%",
            label: t.wonCases,
            color: "text-yellow-500"
        },
        {
            icon: Users,
            value: "1000+",
            label: t.satisfiedCustomers,
            color: "text-blue-500"
        },
        {
            icon: Calendar,
            value: "15",
            label: t.yearsOfExperience,
            color: "text-green-500"
        },
        {
            icon: CheckCircle,
            value: "24/7",
            label: t.clientSupport,
            color: "text-purple-500"
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="fixed inset-0 h-full w-full z-0 filter">
                <Waves
                    backgroundColor="transparent"
                    waveSpeedX={0.05}
                    waveSpeedY={0.05}
                    waveAmpX={25}
                    waveAmpY={25}
                    xGap={15}
                    yGap={15}
                    className="absolute inset-0"
                />
            </div>

            <section className="flex flex-col items-center py-16 px-4 relative z-10">
                <div className="max-w-7xl w-full">
                    {/* Basic content with the image */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        {/* Левая колонка - текст */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left order-2 lg:order-1"
                        >
                            {/* The main title */}
                            <motion.h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-center lg:text-left leading-tight">
                                <div>{t.your}</div>
                                <div className="text-blue-600 h-[1.2em] relative">
                                    <FlipWords
                                        words={t.flipWords}
                                        duration={3500}
                                    />
                                </div>
                                <div>{t.lawyer}</div>
                            </motion.h1>

                            {/* description */}
                            <motion.p
                                className="text-lg mb-8 whitespace-pre-line text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                {t.professionalAssistance}
                            </motion.p>

                            {/* Button */}
                            <motion.button
                                onClick={() => setShowCallbackModal(true)}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transition-all relative overflow-hidden"
                            >
                                <span className="relative z-10">{t.orderCallback}</span>
                            </motion.button>
                        </motion.div>

                        {/* Right column - image */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative order-1 lg:order-2"
                        >
                            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                                <div className="relative aspect-[3/4] w-full">
                                    <Image
                                        src="/Gemini_Generated_Image_example_lawyer.png"
                                        alt={t.professionalLawyer}
                                        fill
                                        className="object-cover rounded-2xl shadow-2xl"
                                        priority
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                    />
                                    {/* Decorative elements */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/*achievement section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {achievements.map((achievement, index) => {
                            const IconComponent = achievement.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className={`p-3 rounded-full bg-background/50 ${achievement.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {achievement.value}
                                        </div>
                                        <div className="text-sm text-muted-foreground text-center leading-tight">
                                            {achievement.label}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {showCallbackModal && (
                    <CallbackModal onClose={() => setShowCallbackModal(false)} />
                )}
            </section>
        </div>
    );
}