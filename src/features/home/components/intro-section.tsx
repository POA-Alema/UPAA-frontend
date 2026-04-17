"use client";

import { FeatureAction } from "@/components/ui/feature-action";
import { useLanguage } from "@/context/LanguageContext";
import { allTranslations } from "@/data/translations";

export function IntroSection() {
  const { language } = useLanguage();
  const t = allTranslations.hero[language];

  return (
    <div className="home-intro__lead mt-12">
      <p className="home-intro__description text-lg text-zinc-300 max-w-2xl mb-8">
        {t.description}
      </p>
      <FeatureAction
        href="/mapa"
        icon="map"
        label={t.cta}
        variant="primary"
      />
    </div>
  );
}