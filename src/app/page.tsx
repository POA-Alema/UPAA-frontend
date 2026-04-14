import { ArchitectPreview } from "@/features/architects/components/ArchitectPreview";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import { IntroSection } from "@/features/home/components/intro-section";
import { MapPreviewSection } from "@/features/home/components/map-preview-section";
import { MapCTA } from "@/features/home/components/map-cta"; 

export default async function HomePage() {
  const featuredArchitect = await getFeaturedArchitect();

  return (
    <main className="page-shell home-flow">
      <div className="page-stack">
        <IntroSection />
        
        <MapCTA /> 
        
        <MapPreviewSection />
        {featuredArchitect ? <ArchitectPreview architect={featuredArchitect} /> : null}
      </div>
    </main>
  );
}