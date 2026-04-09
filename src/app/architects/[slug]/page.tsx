import { notFound } from "next/navigation";
import { ArchitectPage } from "@/features/architects/components/ArchitectPage";
import { getArchitectBySlug, architectsMock } from "@/features/architects/mocks/architect-mock";
import type { Architect } from "@/features/architects/types/architect";

type ArchitectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Fetches architect data from CMS with fallback to local mock.
 * @param slug - The architect's unique URL identifier
 * @returns Architect data or null if not found
 */
async function getArchitectData(slug: string): Promise<Architect | null> {
  try {
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8080';
    const response = await fetch(`${CMS_URL}/api/architects/${slug}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();

      if (data?.slug && data?.title && data?.bioSummary) {
        return data as Architect;
      }
    }
  } catch {
    // Failed to communicate with CMS
  }

  return getArchitectBySlug(slug) || null;
}

/**
 * Generates the page metadata dynamically.
 */
export async function generateMetadata({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = await getArchitectData(slug);

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
 * Generates static routes at build time based on the initial mock data.
 * This ensures that all architect pages are pre-built for better performance.
 */
export function generateStaticParams() {
  return architectsMock.map((architect) => ({
    slug: architect.slug,
  }));
}

/**
 * Main component for the architect detail page.
 * Renders the full architect information using the ArchitectPage component.
 */
export default async function ArchitectDetailPage({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const architect = await getArchitectData(slug);

  if (!architect) {
    notFound();
  }

  return <ArchitectPage architect={architect} />;
}
