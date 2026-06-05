import { architectsMock } from "../mocks/architect-mock";
import type { Architect } from "../types/architect";

const ARCHITECTS_ENDPOINT = "/architects";

type LocalizedField = {
  pt?: string;
};

type ArchitectApiRecord = Partial<Architect> & {
  name?: string;
  nome?: string;
  biography?: string;
  biografia?: string;
  summary?: string;
  resumo?: string;
  imageUrl?: string;
  imageURL?: string;
};

type LandingPageRecord = {
  architectSection?: {
    imageURL?: string;
    imageSubtitle?: LocalizedField;
    title?: LocalizedField;
    subtitle?: LocalizedField;
    content?: LocalizedField;
    CTA?: {
      label?: LocalizedField;
      target?: string;
    };
  } | null;
} | null;

type LandingPageResponse = LandingPageRecord | LandingPageRecord[];

function getLandingPageRecord(
  payload: LandingPageResponse
): LandingPageRecord | null {
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

function extractSlug(target?: string): string | undefined {
  if (!target) {
    return undefined;
  }

  const segments = target.split("/").filter(Boolean);

  return segments.at(-1);
}

function getApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || null;
}

function hasRequiredArchitectFields(
  architect: Partial<Architect>
): architect is Architect {
  return Boolean(
    architect.id &&
      architect.slug &&
      architect.title &&
      architect.bioSummary !== undefined && 
      architect.bio
  );
}

function mapArchitectFromApi(record: ArchitectApiRecord): Architect | null {
  const title = record.title?.trim() || record.name?.trim() || record.nome?.trim();
  const slug = record.slug?.trim();
  const bio =
    record.bio?.trim() ||
    record.biography?.trim() ||
    record.biografia?.trim();
  const bioSummary =
    record.bioSummary?.trim() ||
    record.summary?.trim() ||
    record.resumo?.trim() ||
    "";
  const imageSrc =
    record.image?.src?.trim() ||
    record.imageUrl?.trim() ||
    record.imageURL?.trim();

  const architect: Partial<Architect> = {
    id: record.id ? String(record.id) : slug,
    slug,
    eyebrow: record.eyebrow,
    title,
    bioSummary,
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: record.image?.alt || title || "",
          caption: record.image?.caption,
        }
      : record.image,
    actions: record.actions,
    details: record.details,
    characteristics: record.characteristics,
    works: record.works,
    ctaDescription: record.ctaDescription,
  };

  return hasRequiredArchitectFields(architect) ? architect : null;
}

async function fetchArchitectsFromApi(): Promise<Architect[] | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${ARCHITECTS_ENDPOINT}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as
      | ArchitectApiRecord
      | ArchitectApiRecord[];
    const records = Array.isArray(payload) ? payload : [payload];
    const architects = records
      .map((record) => mapArchitectFromApi(record))
      .filter((architect): architect is Architect => Boolean(architect));

    return architects;
  } catch (error) {
    console.error("[architects] fetchArchitectsFromApi failed:", error);
    return null;
  }
}

function mapFeaturedArchitect(
  payload: LandingPageResponse,
  fallback: Architect
): Architect | null {
  const page = getLandingPageRecord(payload);
  const section = page?.architectSection;
  const title = section?.title?.pt?.trim() || fallback.title;
  const bio = section?.content?.pt?.trim();

  if (!title || !bio) {
    return null;
  }

  const imageSrc = section?.imageURL?.trim();
  const imageCaption = section?.imageSubtitle?.pt?.trim();
  const primaryLabel = section?.CTA?.label?.pt?.trim();
  const primaryHref = section?.CTA?.target?.trim();

  return {
    ...fallback,
    slug: extractSlug(primaryHref) || fallback.slug,
    eyebrow: section?.subtitle?.pt?.trim() || fallback.eyebrow,
    title,
    bioSummary: section?.subtitle?.pt?.trim() || fallback.bioSummary,
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageCaption || title,
          caption: imageCaption || fallback.image?.caption,
        }
      : fallback.image,
    actions: {
      ...fallback.actions,
      primary:
        primaryLabel || primaryHref
          ? {
              label: primaryLabel || fallback.actions?.primary?.label || "",
              href: primaryHref || fallback.actions?.primary?.href,
            }
          : fallback.actions?.primary,
    },
  };
}

export async function listArchitects(): Promise<Architect[]> {
  return (await fetchArchitectsFromApi()) ?? architectsMock;
}

export async function getArchitectBySlug(slug: string): Promise<Architect | null> {
  const architects = await listArchitects();
  return architects.find((architect) => architect.slug === slug) ?? null;
}

export async function getFeaturedArchitect(): Promise<Architect | null> {
  const fallback = architectsMock[0] ?? null;
  const baseUrl = getApiBaseUrl();

  if (!fallback || !baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}/landing-page`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as LandingPageResponse;

    return mapFeaturedArchitect(payload, fallback) ?? fallback;
  } catch {
    return fallback;
  }
}
