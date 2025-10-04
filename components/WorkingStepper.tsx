"use client";

import { motion } from "framer-motion";
import { Phone, Users2, FileText, Briefcase, LucideIcon } from "lucide-react";
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

interface Step {
    icon: LucideIcon;
    titleKey: keyof typeof ru;
    descriptionKey: keyof typeof ru;
}

const steps: Step[] = [
    {
        icon: Phone,
        titleKey: 'step1Title',
        descriptionKey: 'step1Description'
    },
    {
        icon: Users2,
        titleKey: 'step2Title',
        descriptionKey: 'step2Description'
    },
    {
        icon: FileText,
        titleKey: 'step3Title',
        descriptionKey: 'step3Description'
    },
    {
        icon: Briefcase,
        titleKey: 'step4Title',
        descriptionKey: 'step4Description'
    }
];

interface WorkingStepperProps {
    className?: string;
}

// Function to make phone numbers clickable
const makePhoneClickable = (text: string | string[]) => {
    // Handle array case by joining with newlines
    const textString = Array.isArray(text) ? text.join('\n') : text;
    
    const phoneRegex = /(\+375\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2})/g;
    const parts = textString.split(phoneRegex);
    
    return parts.map((part, index) => {
        if (phoneRegex.test(part)) {
            const cleanPhone = part.replace(/[\s\(\)-]/g, '');
            return (
                <a
                    key={index}
                    href={`tel:${cleanPhone}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function WorkingStepper({ className = "" }: WorkingStepperProps) {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className={`mb-16 ${className}`}
        >
            {/* Header */}
            <div className="text-center mb-12">
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                >
                    {t.howToStartWorking}
                </motion.h2>
            </div>

            {/* Desktop Stepper */}
            <div className="hidden lg:block">
                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-16 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0">
                        <motion.div
                            className="h-full bg-slate-600 dark:bg-slate-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 2, duration: 2, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="relative z-10 grid grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 + index * 0.3, duration: 0.6 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Step Circle */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.8 + index * 0.3, duration: 0.4 }}
                                        className="relative mb-6"
                                    >
                                        <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-slate-600 dark:border-slate-400 rounded-full flex items-center justify-center shadow-lg">
                                            <IconComponent size={24} className="text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-600 dark:bg-slate-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2 + index * 0.3, duration: 0.6 }}
                                        className="text-center"
                                    >
                                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                                            {t[step.titleKey]}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-xs">
                                            {makePhoneClickable(t[step.descriptionKey])}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Vertical Stepper */}
            <div className="lg:hidden">
                <div className="relative max-w-2xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700">
                        <motion.div
                            className="w-full bg-slate-600 dark:bg-slate-400"
                            initial={{ height: "0%" }}
                            animate={{ height: "100%" }}
                            transition={{ delay: 2, duration: 2, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-12">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.6 + index * 0.3, duration: 0.6 }}
                                    className="relative flex items-start gap-6"
                                >
                                    {/* Step Circle */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.8 + index * 0.3, duration: 0.4 }}
                                        className="relative flex-shrink-0"
                                    >
                                        <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-slate-600 dark:border-slate-400 rounded-full flex items-center justify-center shadow-lg">
                                            <IconComponent size={24} className="text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-600 dark:bg-slate-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2 + index * 0.3, duration: 0.6 }}
                                        className="flex-1 pt-2"
                                    >
                                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                                            {t[step.titleKey]}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {makePhoneClickable(t[step.descriptionKey])}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}