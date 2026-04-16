import type { Metadata } from "next";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";

export const metadata: Metadata = {
  title: "Mapa | UPAA Frontend",
  description: "Visualizacao em tela cheia do mapa interativo do projeto.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen">
      <MapPlaceholder className="h-screen min-h-screen" />
    </main>
  );
}
