"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

interface MainContainerProps {
  data: any;
  children?: React.ReactNode;
}

export default function MainContainer({ data, children }: MainContainerProps) {
  const { language } = useLanguage();
  
  // Aqui conectamos com o dicionário de traduções
  const t = allTranslations.hero[language];

  // Verificação de segurança (fallback)
  if (!data || (data.title === "" && data.description === "")) {
    return (
      <div data-testid="landing-fallback" className="p-20 text-center text-white">
         {language === 'pt' ? 'Nenhum conteúdo disponível' : 
          language === 'en' ? 'No content available' : 'Kein Inhalt verfügbar'}
      </div>
    );
  }

  return (
    <main data-testid="landing-content" className="w-full min-h-screen bg-black text-white px-8 pt-32">
      <section className="max-w-4xl">
        {/* TRADUÇÃO DA TAG (INTRODUÇÃO) */}
        <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">
          {t.tag}
        </span>
        
        {/* O TÍTULO: Note que usamos {t.title} e NÃO {data.title} */}
        <h2 className="text-5xl md:text-7xl font-bold mt-4 leading-tight">
          {t.title}
        </h2>
        
        {/* O SUBTÍTULO: Note que usamos {t.subtitle} e NÃO {data.description} */}
        <p className="text-xl md:text-2xl text-zinc-400 mt-6 font-medium">
          {t.subtitle}
        </p>
      </section>

      <div className="mt-12">
        {children}
      </div>
    </main>
  );
}