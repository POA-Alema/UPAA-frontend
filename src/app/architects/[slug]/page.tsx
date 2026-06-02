import { notFound } from "next/navigation";
import { ArchitectPage } from "@/features/architects/components/ArchitectPage";
import { getArchitectBySlug, listArchitects } from "@/features/architects/data/architects";
import { resolveArchitectBackToMapHref } from "@/features/architects/utils/navigation";

type ArchitectDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    returnTo?: string | string[];
  }>;
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

export default async function ArchitectDetailPage({
  params,
  searchParams,
}: ArchitectDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const architect = await getArchitectBySlug(slug);

  if (!architect) {
    notFound();
  }

  return (
    <ArchitectPage
      architect={architect}
      backToMapHref={resolveArchitectBackToMapHref(resolvedSearchParams)}
    />
  );
}
