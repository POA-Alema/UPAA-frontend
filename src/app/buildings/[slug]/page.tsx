import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageSection } from '@/components/layout/page-section';
import { BuildingDetailPanel } from '@/features/buildings/components/building-detail-panel';
import { buildings, getBuildingBySlug } from '@/data/buildings';

type BuildingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return buildings.map((building) => ({
    slug: building.slug ?? building.id
  }));
}

export async function generateMetadata({
  params
}: BuildingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);

  if (!building) {
    return {
      title: 'Edificação não encontrada | UPAA Frontend'
    };
  }

  return {
    title: `${building.title} | UPAA Frontend`,
    description: `Estrutura inicial da página ${building.title}.`
  };
}

export default async function BuildingDetailPage({
  params
}: BuildingDetailPageProps) {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);

  if (!building) {
    notFound();
  }

  return (
    <main className="page-shell">
      <PageSection
        eyebrow="Edificação"
        title={building.title}
        description="Descrição"
      >
        <BuildingDetailPanel building={building} />
      </PageSection>
    </main>
  );
}
