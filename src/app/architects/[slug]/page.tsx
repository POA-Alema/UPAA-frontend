import { notFound } from "next/navigation";
import { ArchitectPage } from "@/features/architects/components/ArchitectPage";
import { getArchitectBySlug, listArchitects } from "@/features/architects/data/architects";

type ArchitectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = await getArchitectBySlug(slug);

  if (!architect) {
    return {
      title: "Arquiteto não encontrado",
    };
  }

  return {
    title: `${architect.title} | Uma Porto Alegre Alemã`,
    description: architect.bioSummary,
  };
}

export async function generateStaticParams() {
  const architects = await listArchitects();
  return architects.map((architect) => ({
    slug: architect.slug,
  }));
}

export default async function ArchitectDetailPage({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = await getArchitectBySlug(slug);

  if (!architect) {
    notFound();
  }

  return <ArchitectPage architect={architect} />;
}
