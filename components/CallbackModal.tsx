// components/CallbackModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';
import Link from 'next/link';
import { submitCallback } from "@/app/actions";

interface CallbackModalProps {
    onClose: () => void;
}

export default function CallbackModal({ onClose }: CallbackModalProps) {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    // Schema definition
    const schema = z.object({
        name: z.string().min(1, { message: t.fillRequiredFields }),
        phone: z.string().min(1, { message: t.fillRequiredFields }).refine((val) => {
             const digits = val.replace(/\D/g, '');
             return digits.startsWith('375') ? digits.length === 12 : digits.length === 9;
        }, { message: t.enterValidPhone }),
        email: z.string().email().optional().or(z.literal('')),
        message: z.string().optional(),
        privacyConsent: z.boolean().refine(val => val === true, { message: t.privacyConsentRequired })
    });

    type FormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            message: "",
            privacyConsent: false
        }
    });

    const phoneValue = watch("phone");

    // Block scrolling when opening a modal window
    useEffect(() => {

        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';


        const header = document.querySelector('header');
        const isMobile = window.innerWidth < 768;
        
        if (header && isMobile) {
            header.style.display = 'none';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
            

            if (header) {
                header.style.display = '';
            }
        };
    }, []);

    const formatPhoneNumber = (value: string) => {
        let digits = value.replace(/\D/g, '');

        if (digits.startsWith('375')) {
            digits = digits.substring(3);
        }

        digits = digits.substring(0, 9);

        if (digits.length === 0) return '';
        if (digits.length <= 2) return `+375 (${digits}`;
        if (digits.length <= 5) return `+375 (${digits.substring(0, 2)}) ${digits.substring(2)}`;
        if (digits.length <= 7) return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5)}`;
        return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 7)}-${digits.substring(7)}`;
    };

    const getCleanPhoneNumber = (formattedPhone: string) => {
        const digits = formattedPhone.replace(/\D/g, '');
        
        if (digits.startsWith('375') && digits.length === 12) {
            return `+${digits}`;
        }
        
        if (digits.length === 9) {
            return `+375${digits}`;
        }
        return formattedPhone;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue("phone", formatted, { shouldValidate: true });
    };

    const onSubmit = async (data: FormData) => {
        setSubmitError(null);

        try {
            const cleanPhone = getCleanPhoneNumber(data.phone);
            
            const result = await submitCallback({
                name: data.name,
                phone: cleanPhone,
                email: data.email,
                message: data.message
            });

            if (!result.success) {
                throw new Error(result.error || t.errorSendingRequest);
            }

            setSubmitSuccess(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message || t.errorSendingRequest);
            } else {
                setSubmitError(t.unknownError);
            }
        }
    };

    if (submitSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:p-4">
                <div className="relative w-full h-full md:w-auto md:h-auto md:max-w-md bg-card md:rounded-lg shadow-lg p-6 border flex flex-col justify-center md:justify-start">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent z-10"
                    >
                        <X size={24} className="text-foreground" />
                    </button>
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                            <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-foreground">{t.requestSent}</h2>
                        <p className="mt-2 text-muted-foreground">
                            {t.willContactYou} {getCleanPhoneNumber(phoneValue)}.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            {t.close}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:p-4">
            <div className="relative w-full h-full md:w-auto md:h-auto md:max-w-md bg-card md:rounded-lg shadow-lg p-6 md:max-h-[90vh] overflow-y-auto border">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent z-10"
                >
                    <X size={24} className="text-foreground" />
                </button>

                <div className="h-full flex flex-col md:block">
                    <h2 className="text-2xl font-bold mb-6 text-foreground pt-4 md:pt-0">{t.orderCallback}</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                    <User className="inline-block w-4 h-4 mr-1" />
                                    {t.yourName} *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-input'} bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm`}
                                    placeholder={t.yourName}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                                    <Phone className="inline-block w-4 h-4 mr-1" />
                                    {t.phone} *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register("phone")}
                                    onChange={handlePhoneChange}
                                    placeholder="+375 (XX) XXX-XX-XX"
                                    className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-input'} bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t.phoneHint}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                    <Mail className="inline-block w-4 h-4 mr-1" />
                                    {t.email} {t.optional}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-input'} bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                                    <MessageCircle className="inline-block w-4 h-4 mr-1" />
                                    {t.message} {t.optional}
                                </label>
                                <textarea
                                    id="message"
                                    {...register("message")}
                                    rows={3}
                                    placeholder={t.describeYourSituation}
                                    className="mt-1 block w-full border border-input bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-base md:text-sm"
                                />
                            </div>

                            {/* Checkbox consent to the processing of personal data*/}
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="privacy-consent"
                                    {...register("privacyConsent")}
                                    className="mt-1 h-4 w-4 text-primary focus:ring-ring border-input rounded"
                                />
                                <label htmlFor="privacy-consent" className="text-sm text-foreground">
                                    <Link 
                                        href="/privacy" 
                                        className="text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {t.privacyConsentFull}
                                    </Link>
                                    {' *'}
                                </label>
                            </div>
                            {errors.privacyConsent && <p className="text-red-500 text-xs mt-1">{errors.privacyConsent.message}</p>}

                            {submitError && (
                                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md border border-destructive/20">
                                    {submitError}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 md:pt-0">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-primary-foreground py-3 md:py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-sm font-medium"
                            >
                                {isSubmitting ? t.submitting : t.orderCall}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}