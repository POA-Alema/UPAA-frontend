import { Suspense } from "react";
import { ArchitectPreview } from "@/features/architects/components/ArchitectPreview";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import LandingContent from "@/features/home/components/landing-content";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getLandingData } from "@/features/home/data/landing";

export default async function HomePage() {
  const landingData = await getLandingData();
  const featuredArchitect = await getFeaturedArchitect();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="page-shell home-flow flex-1">
        <div className="page-stack">
          {/* APENAS ESTA CHAMADA DA LANDING */}
          <Suspense fallback={<MainContainerSkeleton />}>
            <LandingContent data={landingData} />
          </Suspense>
          
          {/* APENAS ESTA CHAMADA DO ARQUITETO */}
          {featuredArchitect && (
            <ArchitectPreview architect={featuredArchitect} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}