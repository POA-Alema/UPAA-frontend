"use client";
import Image from 'next/image';
import { FeatureAction } from "@/components/ui/feature-action";


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

function onMapClick() {  window.location.href = "/mapa";
}

  return (
    <section className="flex flex-col items-center w-full py-12">

      <button  onClick={onMapClick} className="w-full h-80 relative bg-slate-200 rounded-lg overflow-hidden shadow-lg mb-8">
        <Image
          src="/mapa-preview.jpg"
          alt={translations[currentLanguage].mapPreviewAltText}
          fill
          title={translations[currentLanguage].mapPreviewAltText}
          className="object-cover text-amber-950"
          priority
        />
      </button>

      <div className="w-full flex justify-center">
        <FeatureAction 
          href="/mapa" 
          icon="map" 
          label= {translations[currentLanguage].mapCTAButton}
          variant="primary" 
        />
      </div>
    </section>
  );
}