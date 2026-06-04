import { Suspense } from "react";
import { ArchitectPreview } from "@/features/architects/components/ArchitectPreview";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import { LandingContent } from "@/features/home/components/landing-content";
import { ImmigrationSection } from "@/features/home/components/immigration-section-container";
import { MapPreviewSection } from "@/features/home/components/map-preview-section";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  const featuredArchitect = await getFeaturedArchitect();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="page-shell home-flow flex-1">
        <div className="page-stack">
          <Suspense fallback={<MainContainerSkeleton />}>
            <LandingContent />
          </Suspense>
          <MapPreviewSection />
          <ImmigrationSection />
          {featuredArchitect ? <ArchitectPreview architect={featuredArchitect} /> : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
