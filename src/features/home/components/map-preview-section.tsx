"use client";
import { FeatureAction } from "@/components/ui/feature-action";
import { IntroSection } from "@/features/home/components/intro-section";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";

export function MapPreviewSection() {
  const translations = {
    en: {
      mapPreviewAltText: "Preview map of Porto Alegre with a focus on some germanic buildings",
      mapCTAButton: "Explore Map",

    },
    de: {
      mapPreviewAltText: "Vorschaukarte von Porto Alegre mit Schwerpunkt auf einigen germanischen Gebäuden",
      mapCTAButton: "Karte Erkunden",
    },
    pt: {
      mapPreviewAltText: "Mapa de Porto Alegre com destaque para alguns edifícios de estilo germânico.",
      mapCTAButton: "Explorar Mapa"
    },

  }
  const currentLanguage = 'pt'

  return (
    <section className="home-flow__section home-map-preview">
      <IntroSection />

      <div
        aria-label={translations[currentLanguage].mapPreviewAltText}
        className="w-full h-80 relative overflow-hidden rounded-3xl shadow-lg"
      >
        <MapPlaceholder className="h-full" />
      </div>

      <div className="w-full flex justify-center home-map-preview__actions">
        <FeatureAction
          href="/mapa"
          icon="map"
          label={translations[currentLanguage].mapCTAButton}
          variant="primary"
        />
      </div>
    </section>
  );
}
