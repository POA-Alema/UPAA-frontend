import type { Metadata } from "next";
import { FeatureAction } from "@/components/ui/feature-action";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";

export const metadata: Metadata = {
  title: "Mapa | UPAA Frontend",
  description: "Visualizacao em tela cheia do mapa interativo do projeto.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen relative">
      <div className="absolute bottom-4 left-4 z-[1000] sm:bottom-6 sm:left-6">
        <FeatureAction
          href="/"
          icon="arrow_back"
          label="Retornar"
          variant="ghost"
        />
      </div>
      <MapPlaceholder className="h-screen min-h-screen" />
    </main>
  );
}
