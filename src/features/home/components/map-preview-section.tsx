"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { IntroSection } from "@/features/home/components/intro-section";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";

export function MapPreviewSection() {
  const [touchActive, setTouchActive] = useState(false);
  const { t } = useTranslation("common");

  const cta = t("home.intro_cta");
  const altText = t("home.map_preview_alt");

  return (
    <section className="home-flow__section home-map-preview">
      <IntroSection />

      <div
        aria-label={altText}
        id="map-preview"
        className="group w-full h-80 relative overflow-hidden rounded-3xl shadow-lg max-w-7xl mx-auto"
        onTouchStart={() => setTouchActive(true)}
        onTouchEnd={() => setTouchActive(false)}
        onTouchCancel={() => setTouchActive(false)}
      >
        <MapPlaceholder className="h-full" showPopups={false} showZoomControls={false} />
        <a
          href="/mapa"
          aria-label={cta}
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-150 bg-ui-overlay group-hover:opacity-100 group-hover:pointer-events-auto ${touchActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <span className="px-6 py-3 bg-ui-accent text-ui-secondary font-bold rounded-lg hover:brightness-95 transition" aria-hidden="false">{cta}</span>
        </a>
      </div>
    </section>
  );
}
