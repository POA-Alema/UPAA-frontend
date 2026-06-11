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

export async function listBuildings(): Promise<Building[]> {
  return buildingsMock;
}

export async function getBuildingBySlug(
  slug: string,
  language: BuildingLanguage = "pt",
): Promise<Building | null> {
  const building = await requestBuildingBySlug(slug, language);

  return building ? mapApiBuilding(building, language) : null;
}

export async function getFeaturedBuilding(): Promise<Building | null> {
  const buildings = await listBuildings();
  return buildings[0] ?? null;
}
