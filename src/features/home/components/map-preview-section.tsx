"use client";

import { MapPlaceholder } from "@/features/map/components/map-placeholder";
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

export function MapPreviewSection() {
  const { language } = useLanguage();
  const t = allTranslations.mapSection[language];

  return (
    <section className="home-flow__section home-map-preview">
      {/* REMOVEMOS a IntroSection daqui para parar a duplicação! */}

      <div
        aria-label={t.mapPreviewAltText}
        className="w-full h-80 relative overflow-hidden rounded-3xl shadow-lg"
      >
        <MapPlaceholder className="h-full" showPopups={false} />
      </div>
    </section>
  );
}