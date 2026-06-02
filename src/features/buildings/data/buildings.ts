import { getPublicRuntimeConfig } from '@/lib/config';
import { buildingsMock } from "../mocks/building-mock";
import type { Building, BuildingImage, BuildingTechnicalSpec, BuildingCharacteristic } from "../types/building";

const API_TIMEOUT_MS = 2_000;

function extractPt(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, string>;
    return obj.pt ?? obj.en ?? obj.de ?? '';
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

function mapApiToBuilding(api: Record<string, unknown>): Building {
  // Backend stores image URLs as relative paths served from the frontend's public/ folder.
  const mediaGallery = Array.isArray(api['mediaGallery'])
    ? (api['mediaGallery'] as Record<string, unknown>[])
    : Array.isArray(api['media_gallery'])
      ? (api['media_gallery'] as Record<string, unknown>[])
      : [];

  const gallery: BuildingImage[] = mediaGallery.map((item) => ({
    src: String(item['url'] ?? ''),
    alt: extractPt(item['caption']) || extractPt(api['name']) || 'Imagem da edificação',
    caption: extractPt(item['caption']) || undefined,
  }));

  const hero: BuildingImage | undefined = gallery[0];

  const features = Array.isArray(api['features'])
    ? (api['features'] as Record<string, unknown>[])
    : [];

  const characteristics: BuildingCharacteristic[] = features.map((f) => ({
    icon: String(f['icon_url'] ?? ''),
    title: extractPt(f['title']),
    description: extractPt(f['description']),
  }));

  const constructionPeriod = extractPt(pick(api, 'constructionPeriod', 'construction_period'));

  const technicalSpecs: BuildingTechnicalSpec[] = [];
  if (pick(api, 'location')) technicalSpecs.push({ label: 'Localização', value: extractPt(pick(api, 'location')) });
  if (constructionPeriod) technicalSpecs.push({ label: 'Data', value: constructionPeriod });
  if (pick(api, 'constructor')) technicalSpecs.push({ label: 'Construção', value: extractPt(pick(api, 'constructor')) });
  if (pick(api, 'ornamentsAuthor', 'ornaments_author')) technicalSpecs.push({ label: 'Ornamentos', value: extractPt(pick(api, 'ornamentsAuthor', 'ornaments_author')) });
  if (pick(api, 'builtArea', 'built_area')) technicalSpecs.push({ label: 'Área Construída', value: extractPt(pick(api, 'builtArea', 'built_area')) });
  if (pick(api, 'currentOccupation', 'current_occupation')) technicalSpecs.push({ label: 'Ocupação Atual', value: extractPt(pick(api, 'currentOccupation', 'current_occupation')) });
  if (pick(api, 'restorationAndHeritage', 'restoration_and_heritage')) technicalSpecs.push({ label: 'Restauração', value: extractPt(pick(api, 'restorationAndHeritage', 'restoration_and_heritage')) });

  const architectName = typeof api['architect'] === 'object' && api['architect']
    ? extractPt((api['architect'] as Record<string, unknown>)['name'])
    : String(api['architect'] ?? '');

  const eyebrowParts = [architectName, constructionPeriod].filter(Boolean);

  return {
    id: String(api['id'] ?? api['_id'] ?? ''),
    slug: String(api['slug'] ?? ''),
    eyebrow: eyebrowParts.join(', ') || undefined,
    title: extractPt(pick(api, 'name', 'title')) || '',
    subtitle: extractPt(pick(api, 'originalName', 'original_name')) || undefined,
    summary: extractPt(pick(api, 'description')) || '',
    hero,
    history: extractPt(pick(api, 'history')) || '',
    technicalSpecs: technicalSpecs.length > 0 ? technicalSpecs : undefined,
    characteristics: characteristics.length > 0 ? characteristics : undefined,
    gallery: gallery.length > 0 ? gallery : undefined,
  };
}

async function fetchBuildings(): Promise<Building[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  try {
    const response = await fetch(`${baseUrl}/buildings`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) return buildingsMock;
    const data = await response.json() as Record<string, unknown>[];
    return data.map((item) => mapApiToBuilding(item));
  } catch {
    return buildingsMock;
  }
}

export async function listBuildings(): Promise<Building[]> {
  return fetchBuildings();
}

export async function getBuildingBySlug(slug: string): Promise<Building | null> {
  // The listing endpoint returns a trimmed shape; fetch the detail endpoint for the
  // full resolved building (description, history, features, …).
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  try {
    const response = await fetch(`${baseUrl}/buildings/${slug}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json() as Record<string, unknown>;
      return mapApiToBuilding(data);
    }
  } catch {
    // fall through to mock
  }

  return buildingsMock.find((b) => b.slug === slug) ?? null;
}

export async function getFeaturedBuilding(): Promise<Building | null> {
  const buildings = await listBuildings();
  return buildings[0] ?? null;
}
