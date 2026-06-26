import { getPublicRuntimeConfig } from "@/lib/config";
import type { Architect, ArchitectCharacteristic, ArchitectDetail, ArchitectWork } from "../types/architect";

const ARCHITECTS_ENDPOINT = "/architects";

type LocalizedField =
  | string
  | null
  | undefined
  | {
      pt?: unknown;
      en?: unknown;
      de?: unknown;
      full?: unknown;
      first?: unknown;
      last?: unknown;
    };

type LifeEventRecord = {
  date?: {
    day?: unknown;
    month?: unknown;
    year?: unknown;
    iso?: unknown;
  };
  place?: {
    city?: unknown;
    country?: unknown;
  };
};

type ArchitectApiRecord = Omit<Partial<Architect>, "characteristics" | "works"> & {
  name?: LocalizedField;
  nome?: LocalizedField;
  biography?: LocalizedField;
  biografia?: LocalizedField;
  summary?: LocalizedField;
  resumo?: LocalizedField;
  imageUrl?: string;
  imageURL?: string;
  media?: {
    portrait_url?: unknown;
    portraitUrl?: unknown;
    alt_text?: unknown;
    altText?: unknown;
    caption?: unknown;
  };
  birth?: LifeEventRecord | null;
  death?: LifeEventRecord | null;
  citizenship?: LocalizedField;
  occupation?: LocalizedField;
  about?: LocalizedField;
  characteristics?: {
    style?: LocalizedField;
    influences?: LocalizedField;
    legacy?: LocalizedField;
  };
  works?: Array<{
    id?: string;
    title?: LocalizedField;
    slug?: string;
    description?: LocalizedField;
    imageUrl?: string;
    imageURL?: string;
  }>;
  buildingIds?: string[];
  relatedBuildings?: Array<{
    id: string;
    slug: string;
    title: LocalizedField;
    summary?: LocalizedField;
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

function getLandingPageRecord(payload: LandingPageResponse): LandingPageRecord | null {
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getLocalized(field: LocalizedField, lang: string): string | undefined {
  if (typeof field === "string") {
    return field.trim() || undefined;
  }

  if (!isRecord(field)) {
    return undefined;
  }

  const langKey = lang === "en" || lang === "de" ? lang : "pt";
  const preferred = toTrimmedString(field[langKey]);
  const pt = toTrimmedString(field.pt);
  const en = toTrimmedString(field.en);
  const de = toTrimmedString(field.de);
  const full = toTrimmedString(field.full);
  const first = toTrimmedString(field.first);
  const last = toTrimmedString(field.last);
  const composedName = [first, last].filter(Boolean).join(" ");

  return preferred || pt || en || de || full || composedName || undefined;
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

function hasRequiredArchitectFields(architect: Partial<Architect>): architect is Architect {
  return Boolean(
    architect.id &&
      architect.slug &&
      architect.title &&
      architect.bioSummary !== undefined &&
      architect.bio,
  );
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").trim();
}

function summarize(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return stripHtml(value).split(/(?<=[.!?])\s+/)[0] ?? "";
}

function pickMediaString(
  media: ArchitectApiRecord["media"] | undefined,
  ...keys: Array<keyof NonNullable<ArchitectApiRecord["media"]>>
): string | undefined {
  if (!media) {
    return undefined;
  }

  for (const key of keys) {
    const value = toTrimmedString(media[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
}

function getDetailLabels(lang: string) {
  if (lang === "en") {
    return {
      birth: "Birth",
      death: "Death",
      citizenship: "Citizenship",
      occupation: "Occupation",
    };
  }

  if (lang === "de") {
    return {
      birth: "Geburt",
      death: "Tod",
      citizenship: "Staatsangehorigkeit",
      occupation: "Beruf",
    };
  }

  return {
    birth: "Nascimento",
    death: "Falecimento",
    citizenship: "Nacionalidade",
    occupation: "Ocupacao",
  };
}

function getCharacteristicLabels(lang: string) {
  if (lang === "en") {
    return {
      style: "Style",
      influences: "Influences",
      legacy: "Legacy",
    };
  }

  if (lang === "de") {
    return {
      style: "Stil",
      influences: "Einflusse",
      legacy: "Vermachtnis",
    };
  }

  return {
    style: "Estilo",
    influences: "Influencias",
    legacy: "Legado",
  };
}

function formatLifeEvent(event: LifeEventRecord | null | undefined) {
  if (!event) {
    return undefined;
  }

  const year = typeof event.date?.year === "number" ? String(event.date.year) : undefined;
  const city = toTrimmedString(event.place?.city);
  const country = toTrimmedString(event.place?.country);
  const subValue = [city, country].filter(Boolean).join(", ");

  if (!year && !subValue) {
    return undefined;
  }

  return {
    value: year || subValue,
    subValue: year ? subValue || undefined : undefined,
  };
}

function mapDetails(record: ArchitectApiRecord, lang: string): ArchitectDetail[] | undefined {
  const labels = getDetailLabels(lang);
  const birth = formatLifeEvent(record.birth);
  const death = formatLifeEvent(record.death);
  const citizenship = getLocalized(record.citizenship, lang);
  const occupation = getLocalized(record.occupation, lang);
  const details = [
    birth ? { label: labels.birth, ...birth } : null,
    death ? { label: labels.death, ...death } : null,
    citizenship ? { label: labels.citizenship, value: citizenship } : null,
    occupation ? { label: labels.occupation, value: occupation } : null,
  ].filter((detail): detail is ArchitectDetail => Boolean(detail));

  return details.length > 0 ? details : undefined;
}

function mapCharacteristics(
  record: ArchitectApiRecord,
  lang: string,
): ArchitectCharacteristic[] | undefined {
  const labels = getCharacteristicLabels(lang);
  const style = getLocalized(record.characteristics?.style, lang);
  const influences = getLocalized(record.characteristics?.influences, lang);
  const legacy = getLocalized(record.characteristics?.legacy, lang);
  const characteristics = [
    style ? { icon: "architecture", title: labels.style, description: style } : null,
    influences ? { icon: "travel_explore", title: labels.influences, description: influences } : null,
    legacy ? { icon: "account_balance", title: labels.legacy, description: legacy } : null,
  ].filter((characteristic): characteristic is ArchitectCharacteristic => Boolean(characteristic));

  return characteristics.length > 0 ? characteristics : undefined;
}

function mapWorks(record: ArchitectApiRecord, lang: string): ArchitectWork[] | undefined {
  const works: ArchitectWork[] = [];

  if (Array.isArray(record.works)) {
    works.push(
      ...record.works
        .map((work): ArchitectWork | null => {
          const title = getLocalized(work.title, lang);
          if (!title) {
            return null;
          }

          const imageSrc = work.imageURL || work.imageUrl;
          const description = getLocalized(work.description, lang);
          const mappedWork: ArchitectWork = { title };

          if (work.slug) {
            mappedWork.href = `/buildings/${work.slug}`;
          }

          if (imageSrc) {
            mappedWork.image = {
              src: imageSrc,
              alt: title,
              caption: description,
              title,
              description,
            };
          }

          return mappedWork;
        })
        .filter((work): work is ArchitectWork => work !== null),
    );
  }

  if (Array.isArray(record.relatedBuildings)) {
    works.push(
      ...record.relatedBuildings
        .map((building): ArchitectWork | null => {
          const title = getLocalized(building.title, lang);
          if (!title || !building.slug) {
            return null;
          }

          const summary = getLocalized(building.summary, lang);
          const mappedWork: ArchitectWork = {
            title,
            href: `/buildings/${building.slug}`,
          };

          if (building.imageUrl) {
            mappedWork.image = {
              src: building.imageUrl,
              alt: title,
              caption: summary,
              title,
              description: summary,
            };
          }

          return mappedWork;
        })
        .filter((work): work is ArchitectWork => work !== null),
    );
  }

  return works.length > 0 ? works : undefined;
}

function mapArchitectFromApi(record: ArchitectApiRecord, lang: string): Architect | null {
  const title =
    getLocalized(record.title as LocalizedField, lang) ||
    getLocalized(record.name, lang) ||
    getLocalized(record.nome, lang);
  const slug = toTrimmedString(record.slug);
  const bio =
    getLocalized(record.bio as LocalizedField, lang) ||
    getLocalized(record.biography, lang) ||
    getLocalized(record.biografia, lang) ||
    getLocalized(record.about, lang);
  const bioSummary =
    getLocalized(record.bioSummary as LocalizedField, lang) ||
    getLocalized(record.summary, lang) ||
    getLocalized(record.resumo, lang) ||
    summarize(bio);
  const imageSrc =
    record.image?.src?.trim() ||
    record.imageUrl?.trim() ||
    record.imageURL?.trim() ||
    pickMediaString(record.media, "portrait_url", "portraitUrl");
  const imageAlt =
    record.image?.alt ||
    pickMediaString(record.media, "alt_text", "altText") ||
    title ||
    "";
  const occupation = getLocalized(record.occupation, lang);

  const architect: Partial<Architect> = {
    id: record.id ? String(record.id) : slug,
    slug,
    eyebrow: record.eyebrow || occupation,
    title,
    bioSummary,
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageAlt,
          caption: record.image?.caption || pickMediaString(record.media, "caption"),
          title: record.image?.title,
          description: record.image?.description,
        }
      : record.image,
    actions: record.actions,
    details: record.details || mapDetails(record, lang),
    characteristics: mapCharacteristics(record, lang),
    works: mapWorks(record, lang),
  };

  return hasRequiredArchitectFields(architect) ? architect : null;
}

async function fetchArchitectsFromApi(lang = "pt"): Promise<Architect[]> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return [];
  }

  const url = new URL(ARCHITECTS_ENDPOINT, baseUrl);
  url.searchParams.set("lang", lang);
  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar arquitetos.`);
  }

  const payload = (await response.json()) as ArchitectApiRecord | ArchitectApiRecord[];
  const records = Array.isArray(payload) ? payload : [payload];
  return records
    .map((record) => mapArchitectFromApi(record, lang))
    .filter((architect): architect is Architect => Boolean(architect));
}

async function fetchArchitectBySlugFromApi(
  slug: string,
  lang = "pt",
): Promise<Architect | null> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl || !slug) {
    return null;
  }

  try {
    const url = new URL(
      `${ARCHITECTS_ENDPOINT}/${encodeURIComponent(slug)}`,
      baseUrl,
    );
    url.searchParams.set("lang", lang);
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ArchitectApiRecord;
    return mapArchitectFromApi(payload, lang);
  } catch (error) {
    console.error("[architects] fetchArchitectBySlugFromApi failed:", error);
    return null;
  }
}

function mapFeaturedArchitect(payload: LandingPageResponse, lang: string): Architect | null {
  const page = getLandingPageRecord(payload);
  const section = page?.architectSection;
  const title = getLocalized(section?.title, lang);
  const bio = getLocalized(section?.content, lang);
  const primaryHref = section?.CTA?.target?.trim();
  const slug = extractSlug(primaryHref);

  if (!title || !bio || !slug) {
    return null;
  }

  const imageSrc = section?.imageURL?.trim();
  const imageCaption = getLocalized(section?.imageSubtitle, lang);
  const primaryLabel = getLocalized(section?.CTA?.label, lang);
  const subtitle = getLocalized(section?.subtitle, lang);

  return {
    id: slug,
    slug,
    eyebrow: subtitle,
    title,
    bioSummary: subtitle || summarize(bio),
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
  return fetchArchitectsFromApi(lang);
}

export async function getArchitectBySlug(
  slug: string,
  lang = "pt",
): Promise<Architect | null> {
  const fromApi = await fetchArchitectBySlugFromApi(slug, lang);
  if (fromApi) {
    return fromApi;
  }

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
