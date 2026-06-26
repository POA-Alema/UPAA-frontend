import { getPublicRuntimeConfig } from "@/lib/config";
import {
  trackBuildingDetailLoadFailure,
  trackBuildingDetailLoadSuccess,
} from "../utils/building-analytics";
import { buildingsMock } from "../mocks/building-mock";
import type {
  Building,
  BuildingCharacteristic,
  BuildingImage,
  BuildingTechnicalSpec,
} from "../types/building";

export type BuildingLanguage = "pt" | "en" | "de";

type LocalizedText =
  | string
  | Partial<Record<BuildingLanguage, string>>
  | null
  | undefined;

interface ApiBuildingFeature {
  icon_url?: string;
  title?: LocalizedText;
  description?: LocalizedText;
}

interface ApiBuildingMedia {
  url?: string;
  type?: string;
  caption?: LocalizedText;
  alt?: LocalizedText;
  alt_text?: LocalizedText;
}

interface ApiBuilding {
  id: string;
  slug: string;
  architect_slug?: string;
  name?: LocalizedText;
  original_name?: LocalizedText;
  location?: LocalizedText;
  construction_period?: string | null;
  constructor?: string | null;
  ornaments_author?: string | null;
  built_area?: string | null;
  current_occupation?: LocalizedText;
  restoration_and_heritage?: LocalizedText;
  description?: LocalizedText;
  history?: LocalizedText;
  features?: ApiBuildingFeature[];
  media_gallery?: ApiBuildingMedia[];
}

const REQUEST_TIMEOUT_MS = 4_000;

const labels = {
  pt: {
    location: "Localização",
    date: "Data",
    constructor: "Construção",
    ornaments: "Ornamentos e Esculturas",
    builtArea: "Área Construída",
    currentOccupation: "Ocupação Atual",
    restoration: "Restauração e Tombamento",
    backToMap: "Voltar ao Mapa",
    image: "Imagem",
  },
  en: {
    location: "Location",
    date: "Date",
    constructor: "Construction",
    ornaments: "Ornaments and Sculptures",
    builtArea: "Built Area",
    currentOccupation: "Current Occupation",
    restoration: "Restoration and Heritage",
    backToMap: "Back to Map",
    image: "Image",
  },
  de: {
    location: "Standort",
    date: "Datum",
    constructor: "Bauausführung",
    ornaments: "Ornamente und Skulpturen",
    builtArea: "Bebaute Fläche",
    currentOccupation: "Aktuelle Nutzung",
    restoration: "Restaurierung und Denkmalschutz",
    backToMap: "Zurück zur Karte",
    image: "Bild",
  },
} as const;

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item !== null && item !== undefined);
}

export function resolveBuildingLanguage(
  value?: string | string[],
): BuildingLanguage {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (
    normalizedValue === "pt" ||
    normalizedValue === "en" ||
    normalizedValue === "de"
  ) {
    return normalizedValue;
  }

  return "pt";
}

function resolveLocalizedText(
  value: LocalizedText,
  language: BuildingLanguage,
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value) {
    return "";
  }

  return (
    value[language]?.trim() ||
    value.pt?.trim() ||
    value.en?.trim() ||
    value.de?.trim() ||
    ""
  );
}

function createTechnicalSpec(
  label: string,
  value?: string | null,
): BuildingTechnicalSpec | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? { label, value: normalizedValue } : null;
}

function mapImage(
  image: ApiBuildingMedia,
  buildingTitle: string,
  language: BuildingLanguage,
): BuildingImage | null {
  const src = image.url?.trim();

  if (!src) {
    return null;
  }

  const caption = resolveLocalizedText(image.caption, language);
  const alt =
    resolveLocalizedText(image.alt_text, language) ||
    resolveLocalizedText(image.alt, language) ||
    caption ||
    `${labels[language].image}: ${buildingTitle}`;

  return {
    src,
    alt,
    caption: caption || undefined,
  };
}

function mapCharacteristic(
  feature: ApiBuildingFeature,
  language: BuildingLanguage,
): BuildingCharacteristic | null {
  const title = resolveLocalizedText(feature.title, language);
  const description = resolveLocalizedText(feature.description, language);

  if (!title || !description) {
    return null;
  }

  return {
    icon: "architecture",
    title,
    description,
  };
}

function mapApiBuilding(
  building: ApiBuilding,
  language: BuildingLanguage,
): Building {
  const currentLabels = labels[language];
  const title = resolveLocalizedText(building.name, language);
  const description = resolveLocalizedText(building.description, language);
  const history = resolveLocalizedText(building.history, language);
  const gallery = compact(
    (building.media_gallery ?? []).map((image) =>
      mapImage(image, title, language),
    ),
  );

  return {
    id: building.id,
    slug: building.slug,
    eyebrow: building.construction_period?.trim() || undefined,
    title,
    subtitle: resolveLocalizedText(building.original_name, language) || undefined,
    summary: description || history,
    hero: gallery[0],
    history: history || description,
    technicalSpecs: compact([
      createTechnicalSpec(
        currentLabels.location,
        resolveLocalizedText(building.location, language),
      ),
      createTechnicalSpec(currentLabels.date, building.construction_period),
      createTechnicalSpec(currentLabels.constructor, building.constructor),
      createTechnicalSpec(currentLabels.ornaments, building.ornaments_author),
      createTechnicalSpec(currentLabels.builtArea, building.built_area),
      createTechnicalSpec(
        currentLabels.currentOccupation,
        resolveLocalizedText(building.current_occupation, language),
      ),
      createTechnicalSpec(
        currentLabels.restoration,
        resolveLocalizedText(building.restoration_and_heritage, language),
      ),
    ]),
    characteristics: compact(
      (building.features ?? []).map((feature) =>
        mapCharacteristic(feature, language),
      ),
    ),
    gallery,
    architectCta: building.architect_slug
      ? {
          description: "",
          label: "",
          href: `/architects/${building.architect_slug}`,
        }
      : undefined,
    actions: {
      backToMap: {
        label: currentLabels.backToMap,
        href: "/mapa",
      },
    },
  };
}

async function requestBuildingBySlug(
  slug: string,
  language: BuildingLanguage,
): Promise<ApiBuilding | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const { apiUrl } = getPublicRuntimeConfig();

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/buildings/${encodeURIComponent(slug)}?lang=${language}`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (response.status === 404) {
      trackBuildingDetailLoadFailure({
        slug,
        language,
        status: response.status,
        reason: "not_found",
      });
      return null;
    }

    if (!response.ok) {
      trackBuildingDetailLoadFailure({
        slug,
        language,
        status: response.status,
        reason: "service_error",
      });
      return null;
    }

    const building = (await response.json()) as ApiBuilding;

    trackBuildingDetailLoadSuccess({
      slug,
      language,
      buildingId: building.id,
      status: response.status,
    });

    return building;
  } catch (error) {
    trackBuildingDetailLoadFailure({
      slug,
      language,
      reason: "request_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

const API_TIMEOUT_MS = 2_000;

const ARCHITECT_DETAIL_PATH = "/architects/theodor-wiederspahn";

// Placeholder de texto livre até o CMS enviar a descrição das imagens.
const IMAGE_DESCRIPTION_PLACEHOLDER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type SpecLang = 'pt' | 'en' | 'de';

const SPEC_LABELS: Record<string, Record<SpecLang, string>> = {
  location:     { pt: 'Localização',     en: 'Location',       de: 'Standort' },
  date:         { pt: 'Data',            en: 'Date',           de: 'Datum' },
  project:      { pt: 'Projeto',         en: 'Design',         de: 'Entwurf' },
  construction: { pt: 'Construção',      en: 'Construction',   de: 'Bau' },
  ornaments:    { pt: 'Ornamentos',      en: 'Ornamentation',  de: 'Ornamentik' },
  builtArea:    { pt: 'Área Construída', en: 'Built Area',     de: 'Bebaute Fläche' },
  currentOcc:   { pt: 'Ocupação Atual',  en: 'Current Use',    de: 'Aktuelle Nutzung' },
  restoration:  { pt: 'Restauração',     en: 'Restoration',    de: 'Restaurierung' },
};

const ARCHITECT_CTA_DESCRIPTION: Record<SpecLang, (name: string) => string> = {
  pt: (name) => `Explore a vida e o legado de ${name}, o arquiteto que moldou a paisagem urbana de Porto Alegre com suas obras monumentais.`,
  en: (name) => `Explore the life and legacy of ${name}, the architect who shaped Porto Alegre's urban landscape with monumental works.`,
  de: (name) => `Erkunden Sie das Leben und Vermächtnis von ${name}, dem Architekten, der die Stadtlandschaft von Porto Alegre mit monumentalen Werken prägte.`,
};

const ARCHITECT_CTA_LABEL: Record<SpecLang, string> = {
  pt: 'Conheça mais sobre o Arquiteto',
  en: 'Learn more about the Architect',
  de: 'Mehr über den Architekten erfahren',
};

function specLabel(key: string, lang: string): string {
  const l = (lang === 'en' || lang === 'de' ? lang : 'pt') as SpecLang;
  return SPEC_LABELS[key]?.[l] ?? SPEC_LABELS[key]?.pt ?? key;
}

function extractLocalized(value: unknown, lang = 'pt'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, string>;
    const l = lang as SpecLang;
    return obj[l] ?? obj.pt ?? obj.en ?? obj.de ?? '';
  }
  return '';
}

// Backend serves both camelCase (older) and snake_case (current) field names.
function pick(api: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (api[key] !== undefined && api[key] !== null) return api[key];
  }
  return undefined;
}

function mapApiToBuilding(api: Record<string, unknown>, lang = 'pt'): Building {
  // Backend stores absolute URLs pointing at the public S3 bucket (see src/lib/s3.ts).
  const mediaGallery = Array.isArray(api['mediaGallery'])
    ? (api['mediaGallery'] as Record<string, unknown>[])
    : Array.isArray(api['media_gallery'])
      ? (api['media_gallery'] as Record<string, unknown>[])
      : [];

  const gallery: BuildingImage[] = mediaGallery.map((item) => {
    const itemCaption = extractLocalized(item['caption'], lang);
    const buildingName = extractLocalized(api['name'], lang);
    return {
      src: String(item['url'] ?? ''),
      alt: itemCaption || buildingName || 'Imagem da edificação',
      caption: itemCaption || undefined,
      // Placeholder até o CMS enviar título/texto livre das imagens.
      title:
        extractLocalized(item['title'], lang) || itemCaption || buildingName || 'Imagem da edificação',
      description: extractLocalized(item['description'], lang) || IMAGE_DESCRIPTION_PLACEHOLDER,
    };
  });

  const hero: BuildingImage | undefined = gallery[0];

  const features = Array.isArray(api['features'])
    ? (api['features'] as Record<string, unknown>[])
    : [];

  const characteristics: BuildingCharacteristic[] = features.map((f) => ({
    icon: String(f['icon_url'] ?? f['icon'] ?? ''),
    title: extractLocalized(f['title'], lang),
    description: extractLocalized(f['description'], lang),
  }));

  const constructionPeriod = extractLocalized(pick(api, 'constructionPeriod', 'construction_period'), lang);

  const technicalSpecs: BuildingTechnicalSpec[] = [];
  if (pick(api, 'location')) technicalSpecs.push({ label: specLabel('location', lang), value: extractLocalized(pick(api, 'location'), lang) });
  if (constructionPeriod) technicalSpecs.push({ label: specLabel('date', lang), value: constructionPeriod });
  if (pick(api, 'constructor')) technicalSpecs.push({ label: specLabel('construction', lang), value: extractLocalized(pick(api, 'constructor'), lang) });
  if (pick(api, 'ornamentsAuthor', 'ornaments_author')) technicalSpecs.push({ label: specLabel('ornaments', lang), value: extractLocalized(pick(api, 'ornamentsAuthor', 'ornaments_author'), lang) });
  if (pick(api, 'builtArea', 'built_area')) technicalSpecs.push({ label: specLabel('builtArea', lang), value: extractLocalized(pick(api, 'builtArea', 'built_area'), lang) });
  if (pick(api, 'currentOccupation', 'current_occupation')) technicalSpecs.push({ label: specLabel('currentOcc', lang), value: extractLocalized(pick(api, 'currentOccupation', 'current_occupation'), lang) });
  if (pick(api, 'restorationAndHeritage', 'restoration_and_heritage')) technicalSpecs.push({ label: specLabel('restoration', lang), value: extractLocalized(pick(api, 'restorationAndHeritage', 'restoration_and_heritage'), lang) });

  const architectName = typeof api['architect'] === 'object' && api['architect']
    ? extractLocalized((api['architect'] as Record<string, unknown>)['name'], lang)
    : String(api['architect'] ?? '');

  const eyebrowParts = [architectName, constructionPeriod].filter(Boolean);
  const l = (lang === 'en' || lang === 'de' ? lang : 'pt') as SpecLang;

  return {
    id: String(api['id'] ?? api['_id'] ?? ''),
    slug: String(api['slug'] ?? ''),
    eyebrow: eyebrowParts.join(', ') || undefined,
    title: extractLocalized(pick(api, 'name', 'title'), lang) || '',
    subtitle: extractLocalized(pick(api, 'originalName', 'original_name'), lang) || undefined,
    summary: extractLocalized(pick(api, 'description'), lang) || '',
    hero,
    history: extractLocalized(pick(api, 'history'), lang) || '',
    technicalSpecs: technicalSpecs.length > 0 ? technicalSpecs : undefined,
    characteristics: characteristics.length > 0 ? characteristics : undefined,
    gallery: gallery.length > 0 ? gallery : undefined,
    architectCta: {
      description: ARCHITECT_CTA_DESCRIPTION[l](architectName || 'Theodor Wiederspahn'),
      label: ARCHITECT_CTA_LABEL[l],
      href: ARCHITECT_DETAIL_PATH,
    },
  };
}

async function fetchBuildings(lang = 'pt'): Promise<Building[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  try {
    const response = await fetch(`${baseUrl}/buildings?lang=${lang}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) return getBuildingsMock(lang);
    const data = await response.json() as Record<string, unknown>[];
    return data.map((item) => mapApiToBuilding(item, lang));
  } catch {
    return getBuildingsMock(lang);
  }
}

export async function listBuildings(lang = 'pt'): Promise<Building[]> {
  return fetchBuildings(lang);
}

export async function getBuildingBySlug(slug: string, lang = 'pt'): Promise<Building | null> {
  // The listing endpoint returns a trimmed shape; fetch the detail endpoint for the
  // full resolved building (description, history, features, …).
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  try {
    const response = await fetch(`${baseUrl}/buildings/${slug}?lang=${lang}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json() as Record<string, unknown>;
      return mapApiToBuilding(data, lang);
    }
  } catch {
    // fall through to mock
  }

  return getBuildingsMock(lang).find((b) => b.slug === slug) ?? null;
}

export async function getFeaturedBuilding(lang = 'pt'): Promise<Building | null> {
  const buildings = await listBuildings(lang);
  return buildings[0] ?? null;
}
