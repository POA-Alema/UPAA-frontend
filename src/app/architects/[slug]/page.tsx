import { notFound } from "next/navigation";
import { ArchitectPage } from "@/features/architects/components/ArchitectPage";
import { getArchitectBySlug, architectsMock } from "@/features/architects/mocks/architect-mock";

type ArchitectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Gera os metadados da página dinamicamente com base no slug do arquiteto para fins de SEO.
 */
export async function generateMetadata({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = getArchitectBySlug(slug);

  if (!architect) {
    return {
      title: "Arquiteto não encontrado",
    };
  }

  return {
    title: `${architect.title} | Porto Alegre Mais Alemã`,
    description: architect.bioSummary,
  };
}

/**
 * Gera as rotas estáticas em tempo de build.
 */
export function generateStaticParams() {
  return architectsMock.map((architect) => ({
    slug: architect.slug,
  }));
}

/**
 * Componente principal da página de detalhes do arquiteto.
 */
export default async function ArchitectDetailPage({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = getArchitectBySlug(slug);

  if (!architect) {
    notFound();
  }

  return <ArchitectPage architect={architect} />;
}