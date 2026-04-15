import Image from 'next/image';
import { FeatureAction } from "@/components/ui/feature-action";

export function MapPreviewSection() {
  const translations = {
  en: {
    mapPreviewAltText: "Preview map of Porto Alegre with a focus on some germanic buildings",
    interactiveMap: "Interactive Map",
    botonMapa: "Explore Map",

  },
  de: {
    mapPreviewAltText: "Vorschaukarte von Porto Alegre mit Schwerpunkt auf einigen germanischen Gebäuden",
    botonMapa: "Karte Erkunden",
    interactiveMap: "Interaktive Karte"
  },
  pt: {
    interactiveMap: "Mapa Interativo",
    mapPreviewAltText: "Mapa de Porto Alegre com destaque para alguns edifícios de estilo germânico.",
    botonMapa: "Explorar Mapa"
  },
  
}
const currentLanguage = 'pt'
  return (
    <section className="flex flex-col items-center w-full max-w-7xl mx-auto py-12 px-4">
      <div className="w-full mb-8">
        
        <h2 className="architect-title architect-title--light">
          {translations[currentLanguage].interactiveMap}
        </h2>
        
        <div className="section-divider section-divider--accent mt-6 mb-6" />
        
        <p className="section-copy text-labels/secondary">
          {translations[currentLanguage].mapPreviewAltText}
        </p>
      </div>

      <div className="w-full h-80 relative bg-slate-200 rounded-lg overflow-hidden shadow-lg mb-8">
        <Image
          src="/mapa-preview.jpg"
          alt="Preview of the Porto Alegre German Map"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full flex justify-start">
        <FeatureAction 
          href="/mapa" 
          icon="map" 
          label= {translations[currentLanguage].botonMapa}
          variant="primary" 
        />
      </div>
    </section>
  );
}