import { notFound } from "next/navigation";
import { BuildingPage } from "@/features/buildings/components/BuildingPage";
import {
  getBuildingBySlug,
  listBuildings,
  resolveBuildingLanguage,
} from "@/features/buildings/data/buildings";
import { resolveBuildingBackToMapHref } from "@/features/buildings/utils/navigation";

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
  const language = resolveBuildingLanguage(resolvedSearchParams?.lang);
  const building = await getBuildingBySlug(slug, language);

  if (!building) {
    notFound();
  }

  return (
    <BuildingPage
      building={building}
      backToMapHref={resolveBuildingBackToMapHref(resolvedSearchParams)}
      language={language}
    />
  );
}
