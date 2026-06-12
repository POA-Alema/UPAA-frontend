import { buildBuildingDetailHref } from "@/features/buildings/utils/navigation";

// O acervo é dedicado a Theodor Wiederspahn; o payload do mapa só traz
// architect_id, então o link "Sobre o Autor" usa a rota dele por padrão.
const ARCHITECT_DETAIL_PATH = "/architects/theodor-wiederspahn";

export type BuildingAttachment = {
  src: string;
  alt: string;
  caption?: string;
};

type LocalizedText =
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

type BackendMedia = {
  url?: unknown;
  src?: unknown;
  type?: unknown;
  caption?: unknown;
  alt?: unknown;
  altText?: unknown;
};

export type BackendBuilding = {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  name?: LocalizedText;
  originalName?: LocalizedText;
  location?: LocalizedText;
  coordinates?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  description?: LocalizedText;
  constructionPeriod?: unknown;
  buildYear?: unknown;
  architect?: LocalizedText;
  architect_id?: unknown;
  current_occupation?: LocalizedText;
  mediaGallery?: unknown;
  media_gallery?: unknown;
  images?: unknown;
};

export type Building = {
  id: number | string;
  name: string;
  slug?: string;
  district?: string;
  summary?: string;
  yearLabel?: string;
  architectName?: string;
  architectPath?: string;
  attachments?: BuildingAttachment[];
  latitude?: number;
  longitude?: number;
};

export type MapMarker = {
  id: number | string;
  name: string;
  slug?: string;
  district?: string;
  summary?: string;
  yearLabel?: string;
  architectName?: string;
  routePath?: string;
  architectPath?: string;
  attachments: BuildingAttachment[];
  position: [number, number];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function selectLocalizedText(value: LocalizedText, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }

  if (!isRecord(value)) {
    return fallback;
  }

  const full = typeof value.full === "string" ? value.full : "";
  const first = typeof value.first === "string" ? value.first : "";
  const last = typeof value.last === "string" ? value.last : "";
  const composedName = [first, last].filter(Boolean).join(" ");

  return (
    (typeof value.pt === "string" && value.pt) ||
    (typeof value.en === "string" && value.en) ||
    (typeof value.de === "string" && value.de) ||
    full ||
    composedName ||
    fallback
  );
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function extractCoordinates(building: BackendBuilding): {
  latitude?: number;
  longitude?: number;
} {
  const latitude = toOptionalNumber(building.latitude);
  const longitude = toOptionalNumber(building.longitude);

  if (latitude != null && longitude != null) {
    return { latitude, longitude };
  }

  if (!isRecord(building.coordinates)) {
    return {};
  }

  return {
    latitude: toOptionalNumber(building.coordinates.lat),
    longitude: toOptionalNumber(building.coordinates.lng),
  };
}

function mapBackendMediaToAttachment(
  media: BackendMedia,
  buildingName: string,
): BuildingAttachment | null {
  const src = toOptionalString(media.url) ?? toOptionalString(media.src);

  if (!src) {
    return null;
  }

  const caption = selectLocalizedText(media.caption as LocalizedText);
  const alt =
    selectLocalizedText(media.alt as LocalizedText) ||
    selectLocalizedText(media.altText as LocalizedText) ||
    caption ||
    buildingName;

  return {
    src,
    alt,
    caption: caption || undefined,
  };
}

function extractAttachments(
  mediaGallery: unknown,
  images: unknown,
  buildingName: string,
): BuildingAttachment[] {
  if (Array.isArray(mediaGallery)) {
    return mediaGallery
      .filter(isRecord)
      .map((media) => mapBackendMediaToAttachment(media, buildingName))
      .filter((attachment): attachment is BuildingAttachment => Boolean(attachment));
  }

  if (Array.isArray(images)) {
    return images
      .map((image) =>
        typeof image === "string"
          ? { src: image, alt: buildingName }
          : isRecord(image)
            ? mapBackendMediaToAttachment(image, buildingName)
            : null,
      )
      .filter((attachment): attachment is BuildingAttachment => Boolean(attachment));
  }

  return [];
}

export function mapBackendBuildingToMapBuilding(
  building: BackendBuilding,
  index: number,
): Building {
  const name =
    selectLocalizedText(building.name) ||
    selectLocalizedText(building.title as LocalizedText) ||
    "Edificacao";
  const { latitude, longitude } = extractCoordinates(building);

  return {
    id: toOptionalString(building.id) ?? index,
    name,
    slug: toOptionalString(building.slug),
    district: selectLocalizedText(building.location),
    summary:
      selectLocalizedText(building.description) ||
      selectLocalizedText(building.current_occupation),
    yearLabel:
      toOptionalString(building.constructionPeriod) ??
      toOptionalNumber(building.buildYear)?.toString(),
    architectName: selectLocalizedText(building.architect),
    architectPath: ARCHITECT_DETAIL_PATH,
    attachments: extractAttachments(
      building.mediaGallery ?? building.media_gallery,
      building.images,
      name,
    ),
    latitude,
    longitude,
  };
}

export function mapBackendBuildingsToMapBuildings(
  buildings: BackendBuilding[],
): Building[] {
  return buildings.map(mapBackendBuildingToMapBuilding);
}

export function buildBuildingDetailPath(slug: string) {
  return `/buildings/${slug}`;
}

export function mapBuildingsToMarkers(buildings: Building[]): MapMarker[] {
  return buildings
    .filter((b) => b.latitude != null && b.longitude != null)
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      district: b.district,
      summary: b.summary,
      yearLabel: b.yearLabel,
      architectName: b.architectName,
      routePath: b.slug ? buildBuildingDetailHref(b.slug) : undefined,
      architectPath: b.architectPath,
      attachments: b.attachments ?? [],
      position: [b.latitude!, b.longitude!],
    }));
}
