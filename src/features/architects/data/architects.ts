import { getPublicRuntimeConfig } from "@/lib/config";
import type { Architect } from "../types/architect";

const ARCHITECTS_ENDPOINT = "/architects";

type LocalizedField = {
  pt?: string;
  en?: string;
  de?: string;
} | string;

function getLocalized(field: LocalizedField | undefined, lang: string): string | undefined {
  if (typeof field === "string") {
    return field.trim();
  }

  return field?.[lang as "pt" | "en" | "de"]?.trim();
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
  const { apiUrl } = getPublicRuntimeConfig();
  return apiUrl.replace(/\/$/, "") || null;
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
          title: record.image?.title,
          description: record.image?.description,
        }
      : record.image,
    actions: record.actions,
    works: record.works,
  };

  return hasRequiredArchitectFields(architect) ? architect : null;
}

async function fetchArchitectsFromApi(lang = "pt"): Promise<Architect[] | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return null;
  }

  const url = new URL(ARCHITECTS_ENDPOINT, baseUrl);
  url.searchParams.set("lang", lang);
  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar arquitetos.`);
  }

  const payload = (await response.json()) as
    | ArchitectApiRecord
    | ArchitectApiRecord[];
  const records = Array.isArray(payload) ? payload : [payload];
  return records
    .map((record) => mapArchitectFromApi(record))
    .filter((architect): architect is Architect => Boolean(architect));
}

function mapFeaturedArchitect(
  payload: LandingPageResponse,
  lang: string
): Architect | null {
  const page = getLandingPageRecord(payload);
  const section = page?.architectSection;
  const title = getLocalized(section?.title, lang);
  const bio = getLocalized(section?.content, lang);

  if (!title || !bio) {
    return null;
  }

  const imageSrc = section?.imageURL?.trim();
  const imageCaption = getLocalized(section?.imageSubtitle, lang);
  const primaryLabel = getLocalized(section?.CTA?.label, lang);
  const primaryHref = section?.CTA?.target?.trim();
  const subtitle = getLocalized(section?.subtitle, lang);
  const slug = extractSlug(primaryHref) || "featured-architect";

  return {
    id: slug,
    slug,
    eyebrow: subtitle,
    title,
    bioSummary: subtitle || "",
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageCaption || title,
          caption: imageCaption,
        }
      : undefined,
    actions: {
      primary:
        primaryLabel || primaryHref
          ? {
              label: primaryLabel || "",
              href: primaryHref,
            }
          : undefined,
    },
  };
}

export async function listArchitects(lang = "pt"): Promise<Architect[]> {
  const fromApi = await fetchArchitectsFromApi(lang);
  return fromApi ?? [];
}

export async function getArchitectBySlug(slug: string, lang = "pt"): Promise<Architect | null> {
  const architects = await listArchitects(lang);
  return architects.find((architect) => architect.slug === slug) ?? null;
}

export async function getFeaturedArchitect(lang = "pt"): Promise<Architect | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return null;
  }

  const url = new URL("/landing-page", baseUrl);
  url.searchParams.set("lang", lang);
  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar o arquiteto em destaque.`);
  }

  const payload = (await response.json()) as LandingPageResponse;
  return mapFeaturedArchitect(payload, lang);
}
