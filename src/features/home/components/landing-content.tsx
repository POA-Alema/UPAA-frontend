"use client";

import React from 'react';
import MainContainer from "@/components/layout/MainContainer";
import { IntroSection } from "./intro-section";
import { MapPreviewSection } from "./map-preview-section";
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

export default function LandingContent({ data }: { data: any }) {
  const { language } = useLanguage();
  const tHero = allTranslations.hero[language];

  return (
    <>
      <MainContainer data={data}>
        {/* Título e Subtítulo aparecem aqui UMA vez */}
        <p className="eyebrow">{tHero.tag}</p>
        <h2 className="section-title">{tHero.title}</h2>
        <p className="section-copy">{tHero.subtitle}</p>
        
        {/* A IntroSection (descrição e botão) aparece aqui UMA vez */}
        <IntroSection />
      </MainContainer>

      {/* O Mapa aparece aqui fora, uma única vez */}
      <MapPreviewSection />
    </>
  );
}