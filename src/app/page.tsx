import { Suspense } from "react";
import { cookies } from "next/headers";
import { ArchitectPreview } from "@/features/architects/components/ArchitectPreview";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import { LandingContent } from "@/features/home/components/landing-content";
import { LinksSection } from "@/features/home/components/links-section-container";
import { ImmigrationSection } from "@/features/home/components/immigration-section-container";
import { MapPreviewSection } from "@/features/home/components/map-preview-section";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { resolveLocale, toI18nLanguage } from "@/lib/language";

export default async function HomePage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("upaa:locale")?.value;
  const lang = toI18nLanguage(resolveLocale(localeCookie));
  const featuredArchitect = await getFeaturedArchitect(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="page-shell home-flow flex-1">
        <div className="page-stack">
          <Suspense fallback={<MainContainerSkeleton />}>
            <LandingContent lang={lang} />
          </Suspense>
          <LinksSection />
          <MapPreviewSection />
          <ImmigrationSection />
          {featuredArchitect ? <ArchitectPreview architect={featuredArchitect} /> : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
