import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { BuildingPage } from "@/features/buildings/components/BuildingPage";
import {
  getBuildingBySlug,
  listBuildings,
  resolveBuildingLanguage,
} from "@/features/buildings/data/buildings";
import { resolveBuildingBackToMapHref } from "@/features/buildings/utils/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { resolveLocale, toI18nLanguage } from "@/lib/language";

type BuildingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    returnTo?: string | string[];
    lang?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: BuildingDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = resolveBuildingLanguage(resolvedSearchParams?.lang);
  const building = await getBuildingBySlug(slug, language);

  if (!building) {
    return {
      title: "Edificação não encontrada",
    };
  }

  return {
    title: `${building.title} | Uma Porto Alegre Alemã`,
    description: building.summary,
  };
}

export async function generateStaticParams() {
  const buildings = await listBuildings();

  return buildings.map((building) => ({
    slug: building.slug,
  }));
}

export default async function BuildingDetailPage({
  params,
  searchParams,
}: BuildingDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const cookieStore = await cookies();
  const lang = toI18nLanguage(resolveLocale(cookieStore.get("upaa:locale")?.value));
  const building = await getBuildingBySlug(slug, lang);

  if (!building) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <BuildingPage
          backToMapHref={resolveBuildingBackToMapHref(resolvedSearchParams)}
          building={building}
        />
      </main>
      <Footer />
    </div>
  );
}
