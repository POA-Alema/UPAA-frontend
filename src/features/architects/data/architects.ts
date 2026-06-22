import { getArchitectsMock } from "../mocks/architect-mock";
import type { Architect, ArchitectWork } from "../types/architect";

const ARCHITECTS_ENDPOINT = "/architects";

// Placeholder de texto livre até o CMS enviar a descrição das imagens.
const IMAGE_DESCRIPTION_PLACEHOLDER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type LocalizedField = {
  pt?: string;
  en?: string;
  de?: string;
};

function getLocalized(field: LocalizedField | undefined, lang: string): string | undefined {
  return field?.[lang as keyof LocalizedField]?.trim();
}

type ArchitectApiRecord = Partial<Architect> & {
  name?: string;
  nome?: string;
  biography?: string;
  biografia?: string;
  summary?: string;
  resumo?: string;
  imageUrl?: string;
  imageURL?: string;
  works?: Array<{
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    imageURL?: string;
  }>;
  buildingIds?: string[];
  relatedBuildings?: Array<{
    id: string;
    slug: string;
    title: string;
    summary?: string;
    imageUrl?: string;
  }>;
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

  // Map related buildings or works to ArchitectWork format
  const works: Array<ArchitectWork> = [];
  
  if (Array.isArray(record.works) && record.works.length > 0) {
    works.push(
      ...record.works
        .filter((w): w is typeof record.works[0] & { title: string } => Boolean(w?.title))
        .map((work) => ({
          title: work.title,
          href: work.slug ? `/buildings/${work.slug}` : undefined,
          image: work.imageURL || work.imageUrl
            ? {
                src: (work.imageURL || work.imageUrl) as string,
                alt: work.title,
                caption: work.description,
                title: work.title,
                description: work.description || IMAGE_DESCRIPTION_PLACEHOLDER,
              }
            : undefined,
        }))
    );
  }

  if (Array.isArray(record.relatedBuildings) && record.relatedBuildings.length > 0) {
    works.push(
      ...record.relatedBuildings
        .filter((b): b is typeof record.relatedBuildings[0] & { title: string; slug: string } => Boolean(b?.title && b?.slug))
        .map((building) => ({
          title: building.title,
          href: `/buildings/${building.slug}`,
          image: building.imageUrl
            ? {
                src: building.imageUrl,
                alt: building.title,
                caption: building.summary,
                title: building.title,
                description: building.summary || IMAGE_DESCRIPTION_PLACEHOLDER,
              }
            : undefined,
        }))
    );
  }

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
          // Placeholder até o CMS enviar título/texto livre das imagens.
          title: record.image?.title || record.image?.caption || title,
          description: record.image?.description ?? IMAGE_DESCRIPTION_PLACEHOLDER,
        }
      : record.image,
    actions: record.actions,
    works: works.length > 0 ? works : (record.works as ArchitectWork[] | undefined),
  };

  return hasRequiredArchitectFields(architect) ? architect : null;
}

async function fetchArchitectsFromApi(lang = "pt"): Promise<Architect[] | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return null;
  }

  try {
    const url = new URL(ARCHITECTS_ENDPOINT, baseUrl);
    url.searchParams.set("lang", lang);
    const response = await fetch(url.toString(), {
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

async function fetchArchitectBySlugFromApi(slug: string, lang = "pt"): Promise<Architect | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl || !slug) {
    return null;
  }

  try {
    const url = new URL(`${ARCHITECTS_ENDPOINT}/${slug}`, baseUrl);
    url.searchParams.set("lang", lang);
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ArchitectApiRecord;
    return mapArchitectFromApi(payload);
  } catch (error) {
    console.error("[architects] fetchArchitectBySlugFromApi failed:", error);
    return null;
  }
}

function mapFeaturedArchitect(
  payload: LandingPageResponse,
  fallback: Architect,
  lang: string
): Architect | null {
  const page = getLandingPageRecord(payload);
  const section = page?.architectSection;
  const title = getLocalized(section?.title, lang) || fallback.title;
  const bio = getLocalized(section?.content, lang);

  if (!title || !bio) {
    return null;
  }

  const imageSrc = section?.imageURL?.trim();
  const imageCaption = getLocalized(section?.imageSubtitle, lang);
  const primaryLabel = getLocalized(section?.CTA?.label, lang);
  const primaryHref = section?.CTA?.target?.trim();
  const subtitle = getLocalized(section?.subtitle, lang);

  return {
    ...fallback,
    slug: extractSlug(primaryHref) || fallback.slug,
    eyebrow: subtitle || fallback.eyebrow,
    title,
    bioSummary: subtitle || fallback.bioSummary,
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageCaption || title,
          caption: imageCaption || fallback.image?.caption,
          // Placeholder até o CMS enviar título + texto livre da imagem.
          title: fallback.image?.title,
          description: fallback.image?.description,
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

export async function listArchitects(lang = "pt"): Promise<Architect[]> {
  const fromApi = await fetchArchitectsFromApi(lang);
  return fromApi && fromApi.length > 0 ? fromApi : getArchitectsMock(lang);
}

export async function getArchitectBySlug(slug: string, lang = "pt"): Promise<Architect | null> {
  // First try to fetch the detailed architect data from the dedicated endpoint
  const fromApi = await fetchArchitectBySlugFromApi(slug, lang);
  if (fromApi) {
    return fromApi;
  }

  // Fall back to searching in the list (for backward compatibility)
  const architects = await listArchitects(lang);
  return architects.find((architect) => architect.slug === slug) ?? null;
}

export async function getFeaturedArchitect(lang = "pt"): Promise<Architect | null> {
  const fallback = getArchitectsMock(lang)[0] ?? null;
  const baseUrl = getApiBaseUrl();

  if (!fallback || !baseUrl) {
    return fallback;
  }

  try {
    const url = new URL("/landing-page", baseUrl);
    url.searchParams.set("lang", lang);
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as LandingPageResponse;

    return mapFeaturedArchitect(payload, fallback, lang) ?? fallback;
  } catch {
    return fallback;
  }
}
