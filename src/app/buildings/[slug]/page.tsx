import { notFound } from "next/navigation";
import { BuildingPage } from "@/features/buildings/components/BuildingPage";
import {
  getBuildingBySlug,
  listBuildings,
} from "@/features/buildings/data/buildings";

type BuildingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BuildingDetailPageProps) {
  const { slug } = await params;
  const building = await getBuildingBySlug(slug);

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
}: BuildingDetailPageProps) {
  const { slug } = await params;
  const building = await getBuildingBySlug(slug);

  if (!building) {
    notFound();
  }

  return <BuildingPage building={building} />;
}
