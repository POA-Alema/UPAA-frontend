import { getPublicRuntimeConfig } from '@/lib/config';
import { s3ImageUrl } from '@/lib/s3';
import { getArchitects } from './architects';
import type { ImageCategory, Building, BuildingFormData, BuildingImage, BuildingMaterial } from '@/types/building';

const ENDPOINT_CANDIDATES = [
  '/buildings',
] as const;
const API_TIMEOUT_MS = 2_000;

/**
 * Builds a full URL pointing to the backend's image server.
 * Used when images are served by the backend API (future integration).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _buildBackendImageUrl(path: string): string {
  const { apiUrl } = getPublicRuntimeConfig();
  return `${apiUrl.replace(/\/$/, '')}${path}`;
}

const DEFAULT_FALLBACK_IMAGE = s3ImageUrl('images/margs/Margs.jpg');

function normalizeImage(image: Partial<BuildingImage>, index: number): BuildingImage {
  return {
    id: image.id ?? `image-${index + 1}`,
    url: image.url ?? image.fallbackUrl ?? DEFAULT_FALLBACK_IMAGE,
    fallbackUrl: image.fallbackUrl ?? DEFAULT_FALLBACK_IMAGE,
    alt: image.alt ?? 'Imagem da edificação',
    caption: image.caption,
  };
}

function normalizeMaterial(
  material: Partial<BuildingMaterial>,
  index: number
): BuildingMaterial {
  const allowedTypes = ['plant', 'document', 'analysis'] as const;
  const materialType = material.type as BuildingMaterial['type'] | undefined;
  const type = materialType && allowedTypes.includes(materialType)
    ? materialType
    : 'document';

  return {
    id: material.id ?? `material-${index + 1}`,
    type,
    title: material.title ?? 'Material adicional',
    description: material.description,
    url: material.url,
    previewUrl: material.previewUrl,
    previewAlt: material.previewAlt,
  };
}

function normalizeImages(categories?: Partial<ImageCategory> | null): ImageCategory {
  return {
    floorPlan: (categories?.floorPlan ?? []).map(normalizeImage),
    facades: (categories?.facades ?? []).map(normalizeImage),
    exteriorPhotos: (categories?.exteriorPhotos ?? []).map(normalizeImage),
    interiorPhotos: (categories?.interiorPhotos ?? []).map(normalizeImage),
  };
}

function normalizeBuilding(building: Partial<Building>): Building {
  return {
    id: building.id ?? '',
    title: building.title ?? '',
    location: building.location ?? '',
    coordinates: building.coordinates,
    constructionPeriod: building.constructionPeriod,
    architect: building.architect,
    architectId: building.architectId,
    constructor: building.constructor,
    ornamentsAuthor: building.ornamentsAuthor,
    builtArea: building.builtArea,
    currentOccupation: building.currentOccupation,
    restorationAndHeritage: building.restorationAndHeritage,
    heritage: building.heritage,
    description: building.description,
    history: building.history,
    author: building.author,
    sources: building.sources ?? [],
    materials: (building.materials ?? []).map(normalizeMaterial),
    images: normalizeImages(building.images),
    createdAt: building.createdAt ? new Date(building.createdAt) : undefined,
    updatedAt: building.updatedAt ? new Date(building.updatedAt) : undefined,
  };
}

async function requestBuildingsApi<T>(
  pathSuffix = '',
  init?: RequestInit & { expectJson?: boolean }
): Promise<T | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  for (const endpoint of ENDPOINT_CANDIDATES) {
    const url = `${baseUrl}${endpoint}${pathSuffix}`;

    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
        cache: 'no-store',
      });
    } catch {
      // Network error or timeout — try next endpoint candidate
      continue;
    }

    // Endpoint is reachable: honour the HTTP status, do NOT try other candidates
    if (!response.ok) {
      const bodyText = await response.text();
      let msg = bodyText;
      try {
        const json = JSON.parse(bodyText);
        msg = Array.isArray(json.message) ? json.message.join('; ') : (json.message || JSON.stringify(json));
      } catch {
        // ignore parse error
      }
      throw new Error(`Erro ${response.status}: ${msg}`);
    }

    if (init?.expectJson === false || response.status === 204) {
      return null;
    }

    return (await response.json()) as T;
  }

  throw new Error('Nenhum endpoint de edificações respondeu com sucesso.');
}

/* Adapters: map API <-> FormData (best-effort)
   These provide a bridge between the frontend form shape and the backend API shape.
*/

function mapMediaGalleryToImages(mediaGallery: Record<string, unknown>[] | undefined) {
  const result = {
    floorPlan: [] as BuildingImage[],
    facades: [] as BuildingImage[],
    exteriorPhotos: [] as BuildingImage[],
    interiorPhotos: [] as BuildingImage[],
  };

  if (!Array.isArray(mediaGallery)) return result;

  for (const item of mediaGallery) {
    // Backend stores absolute URLs pointing at the public S3 bucket, so keep them as-is.
    const raw = String(item['url'] ?? item['path'] ?? item['src'] ?? '');
    const img = normalizeImage({
      id: String(item['id'] ?? raw ?? ''),
      url: raw || DEFAULT_FALLBACK_IMAGE,
      alt: extractLocalizedString(item['alt']) ?? extractLocalizedString(item['description']) ?? extractLocalizedString(item['caption']) ?? 'Imagem da edificação',
      caption: extractLocalizedString(item['caption']) || undefined,
    }, 0);
    const type = String(item['type'] ?? '').toLowerCase();
    if (type.includes('planta') || type.includes('floor')) result.floorPlan.push(img);
    else if (type.includes('fachada') || type.includes('facade')) result.facades.push(img);
    else if (type.includes('interna') || type.includes('interior')) result.interiorPhotos.push(img);
    else result.exteriorPhotos.push(img);
  }

  return result;
}

// function mapImagesToMediaGallery(images?: ImageCategory | null) {
//   const out: any[] = [];
//   if (!images) return out;

//   const push = (list: BuildingImage[], type: string) => {
//     for (const img of list) {
//       out.push({ id: img.id, url: img.url, alt: img.alt, caption: img.caption, type });
//     }
//   };

//   push(images.floorPlan ?? [], 'planta_baixa');
//   push(images.facades ?? [], 'fachada');
//   push(images.interiorPhotos ?? [], 'interna');
//   push(images.exteriorPhotos ?? [], 'externa');

//   return out;
// }

function extractLocalizedString(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const s = value.trim();
    return s && s !== '[object Object]' ? s : undefined;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, string>;
    const s = (obj.pt ?? obj.en ?? obj.de ?? '').trim();
    return s && s !== '[object Object]' ? s : undefined;
  }
  return undefined;
}

// The list endpoint (GET /buildings) returns camelCase + localized objects, while the
// detail endpoint (GET /buildings/:id) returns snake_case + already-resolved PT strings.
// Read both shapes by trying every key variant for a field.
function pickField(api: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (api[key] !== undefined && api[key] !== null) return api[key];
  }
  return undefined;
}

function fromApiBuildingToFormData(api: Record<string, unknown>): BuildingFormData {
  const rawSources = pickField(api, 'sources');
  const sources = Array.isArray(rawSources)
    ? (rawSources as unknown[]).map((s, i) =>
        typeof s === 'string'
          ? { id: `s-${i}`, title: s, author: undefined, url: undefined }
          : {
              id: String((s as Record<string, unknown>)['id'] ?? `s-${i}`),
              title: String((s as Record<string, unknown>)['title'] ?? ''),
              author: (s as Record<string, unknown>)['author'] as string | undefined,
              url: (s as Record<string, unknown>)['url'] as string | undefined,
            }
      )
    : [];

  const coords = pickField(api, 'coordinates') as { lat?: number; lng?: number } | undefined;
  const architect = pickField(api, 'architect') as { name?: unknown; id?: string } | undefined;
  const rawGallery = pickField(api, 'mediaGallery', 'media_gallery');
  const mediaGallery = Array.isArray(rawGallery)
    ? (rawGallery as Record<string, unknown>[])
    : undefined;

  return {
    title: extractLocalizedString(pickField(api, 'name', 'title')) ?? '',
    location: extractLocalizedString(pickField(api, 'location')) ?? '',
    coordinates: coords?.lat != null || coords?.lng != null
      ? { lat: coords?.lat as number, lng: coords?.lng as number }
      : undefined,
    description: extractLocalizedString(pickField(api, 'description')) ?? '',
    constructionPeriod: extractLocalizedString(pickField(api, 'constructionPeriod', 'construction_period')),
    architect: architect?.name ? extractLocalizedString(architect.name) : extractLocalizedString(pickField(api, 'architect')),
    architectId: architect?.id ?? (pickField(api, 'architectId', 'architect_id') as string | undefined),
    // backend stores construction company in DB field "constructor" but sends it via DTO field "author"
    constructor: extractLocalizedString(pickField(api, 'constructor', 'author')),
    ornamentsAuthor: extractLocalizedString(pickField(api, 'ornamentsAuthor', 'ornaments_author')),
    builtArea: extractLocalizedString(pickField(api, 'builtArea', 'built_area')),
    currentOccupation: extractLocalizedString(pickField(api, 'currentOccupation', 'current_occupation')),
    restorationAndHeritage: extractLocalizedString(pickField(api, 'restorationAndHeritage', 'restoration_and_heritage')),
    heritage: extractLocalizedString(pickField(api, 'heritage')),
    history: extractLocalizedString(pickField(api, 'history')),
    author: extractLocalizedString(pickField(api, 'author')),
    sources,
    images: mapMediaGalleryToImages(mediaGallery),
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateQrCodeKey(slug: string): string {
  return `POA-${slug.substring(0, 12).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

// Maps the frontend image categories to the backend ImageType enum so the gallery
// keeps its categorization end-to-end (and round-trips back via mapMediaGalleryToImages).
const CATEGORY_IMAGE_TYPE: Record<keyof ImageCategory, string> = {
  floorPlan: 'planta_baixa',
  facades: 'fachada',
  exteriorPhotos: 'externa',
  interiorPhotos: 'interna',
};

function fromFormDataToApiDto(data: BuildingFormData) {
  // Send the gallery as categorized objects { url, type, caption }. The backend stores
  // `type` as the ImageType enum and wraps `caption` as I18nText.
  const images: { url: string; type: string; caption?: string }[] = [];
  if (data.images) {
    (Object.keys(CATEGORY_IMAGE_TYPE) as (keyof ImageCategory)[]).forEach((category) => {
      (data.images?.[category] ?? []).forEach((image) => {
        if (image.url) {
          images.push({
            url: image.url,
            type: CATEGORY_IMAGE_TYPE[category],
            caption: image.caption,
          });
        }
      });
    });
  }

  const possibleAdvanced = data as unknown as Record<string, unknown>;

  const slug = (possibleAdvanced.slug as string | undefined) || generateSlug(data.title);
  const qrCodeKey = (possibleAdvanced.qrCodeKey as string | undefined) || generateQrCodeKey(slug);

  const dto: Record<string, unknown> = {
    slug,
    qrCodeKey,
  };

  if (data.title !== undefined) dto.title = data.title;
  if (data.description !== undefined) dto.description = data.description;
  // backend stores the construction company in the "constructor" db field via dto.author
  if (data.constructor !== undefined) dto.author = data.constructor;
  // Send the array even when empty so removing the last photo clears the
  // gallery on the backend (which also deletes the uploaded objects from S3).
  if (data.images !== undefined) dto.images = images;
  if (data.location !== undefined) dto.location = data.location;
  if (data.constructionPeriod !== undefined) dto.constructionPeriod = data.constructionPeriod;
  if (data.ornamentsAuthor !== undefined) dto.ornamentsAuthor = data.ornamentsAuthor;
  if (data.builtArea !== undefined) dto.builtArea = data.builtArea;
  if (data.currentOccupation !== undefined) dto.currentOccupation = data.currentOccupation;
  if (data.restorationAndHeritage !== undefined) dto.restorationAndHeritage = data.restorationAndHeritage;
  if (data.coordinates?.lat != null || data.coordinates?.lng != null) dto.coordinates = data.coordinates;
  if (data.heritage !== undefined) dto.heritage = data.heritage;
  if (data.history !== undefined) dto.history = data.history;
  if (data.sources !== undefined) {
    dto.sources = (data.sources ?? [])
      .map((s) => (typeof s === 'string' ? s : s.title))
      .filter((title) => typeof title === 'string' && title.trim() !== '');
  }
  if (data.architectId) dto.architectId = data.architectId;
  if (possibleAdvanced.createdById) dto.createdById = possibleAdvanced.createdById;
  if (possibleAdvanced.updatedById) dto.updatedById = possibleAdvanced.updatedById;

  return dto;
}

export async function getBuildings(): Promise<Building[]> {
  try {
    const response = await requestBuildingsApi<Record<string, unknown>[]>('');
    if (!response) return [];

    let architectNames = new Map<string, string>();

    try {
      architectNames = new Map((await getArchitects()).map((a) => [a.id, a.name]));
    } catch (error) {
      console.warn('[buildings] getArchitects failed:', error);
    }

    return response.map((api) => {
      const form = fromApiBuildingToFormData(api);

      const building = normalizeBuilding({
        ...form,
        id: (api['id'] ?? api['_id'] ?? '') as string,
        createdAt: pickField(api, 'createdAt', 'created_at') as Date | undefined,
        updatedAt: pickField(api, 'updatedAt', 'updated_at') as Date | undefined
      });

      if (!building.architect && building.architectId) {
        building.architect = architectNames.get(building.architectId) ?? building.architect;
      }

      return building;
    });
  } catch (error) {
    console.warn('[buildings] getBuildings failed:', error);
    return [];
  }
}

export async function getBuildingById(id: string): Promise<Building | null> {
  const response = await requestBuildingsApi<Record<string, unknown>>(`/${id}`);
  if (!response) return null;
  const form = fromApiBuildingToFormData(response);
  const building = normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? id) as string, createdAt: pickField(response, 'createdAt', 'created_at') as Date | undefined, updatedAt: pickField(response, 'updatedAt', 'updated_at') as Date | undefined });
  // GET only returns architectId; resolve the name from the architects list.
  if (!building.architect && building.architectId) {
    const architect = (await getArchitects()).find((a) => a.id === building.architectId);
    if (architect) building.architect = architect.name;
  }
  return building;
}

export async function createBuilding(data: BuildingFormData): Promise<Building> {
  const response = await requestBuildingsApi<Record<string, unknown>>('', {
    method: 'POST',
    body: JSON.stringify(fromFormDataToApiDto(data)),
  });

  if (!response) throw new Error('Nenhuma resposta do servidor ao criar edificação.');

  const form = fromApiBuildingToFormData(response);
  return normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? '') as string, createdAt: response['createdAt'] as Date | undefined, updatedAt: response['updatedAt'] as Date | undefined });
}

export async function updateBuilding(id: string, data: BuildingFormData): Promise<Building> {
  const dto = fromFormDataToApiDto(data);
  delete dto.slug;
  delete dto.qrCodeKey;
  const response = await requestBuildingsApi<Record<string, unknown>>(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });

  if (!response) throw new Error('Nenhuma resposta do servidor ao atualizar edificação.');

  const form = fromApiBuildingToFormData(response);
  return normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? id) as string, createdAt: response['createdAt'] as Date | undefined, updatedAt: response['updatedAt'] as Date | undefined });
}

export async function deleteBuilding(id: string): Promise<void> {
  await requestBuildingsApi(`/${id}`, {
    method: 'DELETE',
    expectJson: false,
  });
}

export async function uploadBuildingImage(file: File, type = 'externa'): Promise<string> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  const formData = new FormData();
  formData.append('files', file);
  formData.append('metadata', JSON.stringify([{ type, indexes: [0] }]));

  const response = await fetch(`${baseUrl}/buildings/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Falha ao enviar a imagem (HTTP ${response.status}).`);
  }

  const groups = (await response.json()) as Array<{ type: string; urls: string[] }>;
  const url = groups?.[0]?.urls?.[0];

  if (!url) {
    throw new Error('O servidor não retornou a URL da imagem enviada.');
  }

  return url;
}
