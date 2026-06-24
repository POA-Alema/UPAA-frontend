import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildingDetailPageContent } from "@/features/buildings/components/building-detail-page-content";
import { buildings, getBuildingBySlug } from "@/data/buildings";

type BuildingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return buildings.map((building) => ({
    slug: building.id,
  }));
}

export async function generateMetadata({
  params,
}: BuildingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);

  if (!building) {
    return {
      title: "Edificacao nao encontrada | UPAA Frontend",
    };
  }

  return {
    title: `${building.title} | UPAA Frontend`,
    description: `Estrutura inicial da pagina ${building.title}.`,
  };
}

export default async function BuildingDetailPage({
  params,
}: BuildingDetailPageProps) {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);

  if (!building) {
    notFound();
  }

  return (
    <main className="page-shell">
      <BuildingDetailPageContent building={building} />
    </main>
  );
}
