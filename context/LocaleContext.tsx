// context/LocaleContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "ru" | "en" | "by";

interface LocaleContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextProps>({
    locale: "ru",
    setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("ru");

    // Read with LocalStorage at first boot
    useEffect(() => {
        const saved = localStorage.getItem("locale") as Locale;
        if (saved) setLocaleState(saved);
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem("locale", l);
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export const useLocale = () => useContext(LocaleContext);
