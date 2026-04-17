import { ArchitectPreview } from "@/features/architects/components/ArchitectPreview";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import { MapPreviewSection } from "@/features/home/components/map-preview-section";

export default async function HomePage() {
  const featuredArchitect = await getFeaturedArchitect();

  return (
    <main className="page-shell home-flow">
      <div className="page-stack">
        <MapPreviewSection />
        {featuredArchitect ? (
          <ArchitectPreview architect={featuredArchitect} />
        ) : null}
      </div>
    </main>
  );
}
