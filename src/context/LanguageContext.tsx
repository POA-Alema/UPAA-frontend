"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('user-language') as Language;
    if (savedLang && ['pt', 'en', 'de'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('user-language', lang);
  };

  
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
 
  if (!context) {
    return {
      language: 'pt' as Language,
      setLanguage: () => {},
    };
  }
  
  return context;
};