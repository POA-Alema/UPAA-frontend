import Image from 'next/image';
import { FeatureAction } from "@/components/ui/feature-action";

export function MapPreviewSection() {
  return (
    <section className="flex flex-col items-center w-full max-w-7xl mx-auto py-12 px-4">
      <div className="w-full mb-8">
        <p className="eyebrow eyebrow--light mb-2">Mapa</p>
        
        <h2 className="architect-title architect-title--light">
          Mapa interativo
        </h2>
        
        <div className="section-divider section-divider--accent mt-6 mb-6" />
        
        <p className="section-copy text-labels/secondary">
          Explore a presença histórica alemã em Porto Alegre através do nosso mapa interativo.
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
          label="Explorar Mapa" 
          variant="primary" 
        />
      </div>
    </section>
  );
}