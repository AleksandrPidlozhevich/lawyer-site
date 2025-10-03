// components/CallbackModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, MessageCircle } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';
import Link from 'next/link';

interface CallbackModalProps {
    onClose: () => void;
}

export default function CallbackModal({ onClose }: CallbackModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    // Block scrolling when opening a modal window
    useEffect(() => {

        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
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
        setPhone(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            setSubmitError(t.fillRequiredFields);
            return;
        }

        const digits = phone.replace(/\D/g, '');
        const isValidLength = digits.startsWith('375') ? digits.length === 12 : digits.length === 9;
        
        if (!isValidLength) {
            setSubmitError(t.enterValidPhone);
            return;
        }

        if (!privacyConsent) {
            setSubmitError(t.privacyConsentRequired);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const cleanPhone = getCleanPhoneNumber(phone);

            const { error } = await supabase
                .from('callbacks')
                .insert([
                    {
                        client_name: name,
                        client_phone: cleanPhone,
                        client_email: email || null,
                        message: message || null,
                        status: 'pending'
                    }
                ])
                .select();

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            setSubmitSuccess(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message || t.errorSendingRequest);
            } else {
                setSubmitError(t.unknownError);
            }
        } finally {
            setIsSubmitting(false);
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
                            {t.willContactYou} {getCleanPhoneNumber(phone)}.
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
                    <h2 className="text-2xl font-bold mb-6 text-foreground pt-12 md:pt-0">{t.orderCallback}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                    <User className="inline-block w-4 h-4 mr-1" />
                                    {t.yourName} *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-input bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                                    <Phone className="inline-block w-4 h-4 mr-1" />
                                    {t.phone} *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+375 (XX) XXX-XX-XX"
                                    className="mt-1 block w-full border border-input bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm"
                                />
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-input bg-background text-foreground rounded-md shadow-sm p-3 md:p-2 focus:ring-2 focus:ring-ring focus:border-transparent text-base md:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                                    <MessageCircle className="inline-block w-4 h-4 mr-1" />
                                    {t.message} {t.optional}
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
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
                                    checked={privacyConsent}
                                    onChange={(e) => setPrivacyConsent(e.target.checked)}
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

                            {submitError && (
                                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md border border-destructive/20">
                                    {submitError}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 md:pt-0">
                            <button
                                type="submit"
                                disabled={isSubmitting || !name.trim() || !phone.trim() || !privacyConsent}
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