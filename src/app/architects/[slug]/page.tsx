import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArchitectPage } from "@/features/architects/components/ArchitectPage";
import { getArchitectBySlug, listArchitects } from "@/features/architects/data/architects";
import { resolveArchitectBackToMapHref } from "@/features/architects/utils/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { resolveLocale, toI18nLanguage } from "@/lib/language";

const cachedGetArchitectBySlug = cache(getArchitectBySlug);

type ArchitectDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    returnTo?: string | string[];
  }>;
};

export async function generateMetadata({ params }: ArchitectDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const lang = toI18nLanguage(resolveLocale(cookieStore.get("upaa:locale")?.value));
  const architect = await cachedGetArchitectBySlug(slug, lang);

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
  try {
    const architects = await listArchitects();
    return architects.map((architect) => ({ slug: architect.slug }));
  } catch {
    return [];
  }
}

export default async function ArchitectDetailPage({
  params,
  searchParams,
}: ArchitectDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const cookieStore = await cookies();
  const lang = toI18nLanguage(resolveLocale(cookieStore.get("upaa:locale")?.value));
  const architect = await cachedGetArchitectBySlug(slug, lang);

  if (!architect) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ArchitectPage
          architect={architect}
          backToMapHref={resolveArchitectBackToMapHref(resolvedSearchParams)}
        />
      </main>
      <Footer />
    </div>
  );
}
