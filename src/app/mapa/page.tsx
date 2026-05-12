import type { Metadata } from "next";
import { FeatureAction } from "@/components/ui/feature-action";
import { MapPlaceholder } from "@/features/map/components/map-placeholder";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Mapa | UPAA Frontend",
  description: "Visualizacao em tela cheia do mapa interativo do projeto.",
};

export default function MapPage() {
  return (
    <main className="flex flex-col min-h-screen h-screen">
      <Header />
      <MapPlaceholder className="flex-1" />
      <Footer minimized />
    </main>
  );
}
