import { getPublicRuntimeConfig } from '@/lib/config';
import type { ImageCategory, Building, BuildingFormData, BuildingImage } from '@/types/building';

const ENDPOINT_CANDIDATES = [
  '/buildings',
  '/admin/edificacoes',
  '/api/admin/edificacoes',
  '/edificacoes',
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

function createMockImage(
  id: string,
  url: string,
  fallbackUrl: string,
  alt: string,
  caption?: string
): BuildingImage {
  // Mock uses local /public paths directly.
  // use _buildBackendImageUrl(path) after
  return {
    id,
    url,
    fallbackUrl,
    alt,
    caption,
  };
}

function createMockBuildings(): Building[] {
  return [
    {
      id: '1',
      title: 'Museu de Arte do Rio Grande do Sul Ado Malagoli',
      location: 'Praça da Alfândega, Centro Histórico, Porto Alegre, RS',
      constructionPeriod: '1913',
      architect: 'Theo Wiederspahn',
      constructor: '1910-1913',
      ornamentsAuthor: 'Fachada eclética com repertório clássico, pilastras e elementos escultóricos.',
      builtArea: 'Aproximadamente 5.000 m²',
      currentOccupation: 'Museu de arte',
      restorationAndHeritage: 'Conservação preventiva e adequações internas para uso museológico.',
      heritage: 'Integrante do conjunto histórico da Praça da Alfândega.',
      description:
        '<p>Edificação emblemática do Centro Histórico de Porto Alegre, com forte presença institucional e valor arquitetônico. O prédio hoje abriga o MARGS e se destaca pela imponência da fachada e pela relação com o conjunto urbano da praça.</p><p>O cadastro administrativo contempla campos descritivos, fontes dinâmicas e imagens organizadas por categoria.</p>',
      author: 'Theo Wiederspahn',
      sources: [
        {
          id: 'fonte-margs-1',
          title: 'Acervo institucional do MARGS',
          author: 'MARGS',
          url: 'https://www.margs.rs.gov.br/',
        },
        {
          id: 'fonte-margs-2',
          title: 'Levantamento arquitetônico preliminar',
          author: 'Equipe UPAA',
        },
      ],
      images: {
        floorPlan: [
          createMockImage(
            'margs-planta-1',
            '/images/Margs.jpg',
            '/images/Margs.jpg',
            'Vista de apoio do MARGS na categoria planta baixa.',
            'Imagem de referência da categoria Planta baixa.'
          ),
        ],
        facades: [
          createMockImage(
            'margs-fachada-1',
            '/images/Margs.jpg',
            '/images/Margs.jpg',
            'Fachada principal do MARGS.',
            'Imagem principal da fachada do edifício.'
          ),
        ],
        exteriorPhotos: [
          createMockImage(
            'margs-externa-1',
            '/images/Margs.jpg',
            '/images/Margs.jpg',
            'Registro externo do Museu de Arte do Rio Grande do Sul.',
            'Imagem de referência da categoria Fotos externas.'
          ),
        ],
        interiorPhotos: [],
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Memorial do Rio Grande do Sul',
      location: 'Praça da Alfândega, Centro Histórico, Porto Alegre, RS',
      constructionPeriod: '1912',
      architect: 'Theo Wiederspahn',
      constructor: 'Início do século XX',
      ornamentsAuthor: 'Composição eclética com detalhes ornamentais e ritmo vertical nas aberturas.',
      builtArea: 'Aproximadamente 3.800 m²',
      currentOccupation: 'Centro cultural e espaço expositivo',
      restorationAndHeritage: 'Requalificações para uso cultural e expográfico.',
      heritage: 'Bem de interesse histórico e cultural do conjunto da praça.',
      description:
        '<p>O Memorial do Rio Grande do Sul ocupa um edifício de linguagem eclética associado à memória institucional do estado. Sua implantação ajuda a consolidar o caráter cívico do entorno.</p><p>O cadastro reúne informações históricas, campos administrativos e imagens organizadas por categoria.</p>',
      author: 'Theo Wiederspahn',
      sources: [
        {
          id: 'fonte-memorial-1',
          title: 'Portal institucional do Memorial RS',
          author: 'Memorial RS',
        },
        {
          id: 'fonte-memorial-2',
          title: 'Registro fotográfico do edifício',
          author: 'Equipe UPAA',
        },
      ],
      images: {
        floorPlan: [],
        facades: [
          createMockImage(
            'memorial-fachada-1',
            '/images/Memorial RS.jpg',
            '/images/Memorial RS.jpg',
            'Fachada principal do Memorial do Rio Grande do Sul.',
            'Imagem principal da categoria Fachadas.'
          ),
        ],
        exteriorPhotos: [
          createMockImage(
            'memorial-externa-1',
            '/images/Memorial RS.jpg',
            '/images/Memorial RS.jpg',
            'Vista externa do Memorial do Rio Grande do Sul.',
            'Imagem de referência da categoria Fotos externas.'
          ),
        ],
        interiorPhotos: [
          createMockImage(
            'memorial-interna-1',
            '/images/Memorial RS.jpg',
            '/images/Memorial RS.jpg',
            'Imagem de apoio do Memorial RS na categoria fotos internas.',
            'Imagem de referência da categoria Fotos internas.'
          ),
        ],
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];
}

const mockBuildings: Building[] = createMockBuildings();
let nextId = mockBuildings.length + 1;

const DEFAULT_FALLBACK_IMAGE = '/images/Margs.jpg';

function normalizeImage(image: Partial<BuildingImage>, index: number): BuildingImage {
  return {
    id: image.id ?? `image-${index + 1}`,
    url: image.url ?? image.fallbackUrl ?? DEFAULT_FALLBACK_IMAGE,
    fallbackUrl: image.fallbackUrl ?? DEFAULT_FALLBACK_IMAGE,
    alt: image.alt ?? 'Imagem da edificação',
    caption: image.caption,
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
    images: normalizeImages(building.images),
    createdAt: building.createdAt ? new Date(building.createdAt) : undefined,
    updatedAt: building.updatedAt ? new Date(building.updatedAt) : undefined,
  };
}

function cloneBuilding(building: Building): Building {
  return normalizeBuilding(structuredClone(building));
}

function getMockList(): Building[] {
  return mockBuildings.map(cloneBuilding);
}

function getMockById(id: string): Building | null {
  const found = mockBuildings.find((item) => item.id === id);
  return found ? cloneBuilding(found) : null;
}

function createMock(data: BuildingFormData): Building {
  const newBuilding = normalizeBuilding({
    ...data,
    id: String(nextId++),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  mockBuildings.push(newBuilding);
  return cloneBuilding(newBuilding);
}

function updateMock(id: string, data: BuildingFormData): Building {
  const index = mockBuildings.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Edificação com ID ${id} não encontrada`);
  }

  const updated = normalizeBuilding({
    ...mockBuildings[index],
    ...data,
    id,
    createdAt: mockBuildings[index].createdAt,
    updatedAt: new Date(),
  });

  mockBuildings[index] = updated;
  return cloneBuilding(updated);
}

function deleteMock(id: string): void {
  const index = mockBuildings.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Edificação com ID ${id} não encontrada`);
  }

  mockBuildings.splice(index, 1);
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

function fromApiBuildingToFormData(api: Record<string, unknown>): BuildingFormData {
  const sources = Array.isArray(api?.['sources'])
    ? (api['sources'] as Record<string, unknown>[]).map((s, i) => ({ id: String(s['id'] ?? `s-${i}`), title: String(s['title'] ?? ''), author: s['author'] as string | undefined, url: s['url'] as string | undefined }))
    : [];

  const coords = api['coordinates'] as { lat?: number; lng?: number } | undefined;
  const architect = api['architect'] as { name?: unknown; id?: string } | undefined;
  const mediaGallery = Array.isArray(api['mediaGallery'])
    ? (api['mediaGallery'] as Record<string, unknown>[])
    : undefined;

  return {
    title: extractLocalizedString(api['name']) ?? extractLocalizedString(api['title']) ?? '',
    location: extractLocalizedString(api['location']) ?? '',
    coordinates: coords?.lat != null || coords?.lng != null
      ? { lat: coords?.lat as number, lng: coords?.lng as number }
      : undefined,
    description: extractLocalizedString(api['description']) ?? '',
    constructionPeriod: extractLocalizedString(api['constructionPeriod']),
    architect: architect?.name ? extractLocalizedString(architect.name) : extractLocalizedString(api['architect']),
    architectId: architect?.id ?? (api['architectId'] as string | undefined),
    // backend stores construction company in DB field "constructor" but sends it via DTO field "author"
    constructor: extractLocalizedString(api['constructor']) ?? extractLocalizedString(api['author']),
    ornamentsAuthor: extractLocalizedString(api['ornamentsAuthor']),
    builtArea: extractLocalizedString(api['builtArea']),
    currentOccupation: extractLocalizedString(api['currentOccupation']),
    restorationAndHeritage: extractLocalizedString(api['restorationAndHeritage']),
    heritage: extractLocalizedString(api['heritage']),
    history: extractLocalizedString(api['history']),
    author: extractLocalizedString(api['author']),
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

function fromFormDataToApiDto(data: BuildingFormData) {
  const imagesUrls = [] as string[];
  if (data.images) {
    imagesUrls.push(...((data.images.floorPlan ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.facades ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.exteriorPhotos ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.interiorPhotos ?? []).map((i) => i.url) as string[]));
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
  if (imagesUrls.length > 0) dto.images = imagesUrls;
  if (data.location !== undefined) dto.location = data.location;
  if (data.constructionPeriod !== undefined) dto.constructionPeriod = data.constructionPeriod;
  if (data.ornamentsAuthor !== undefined) dto.ornamentsAuthor = data.ornamentsAuthor;
  if (data.builtArea !== undefined) dto.builtArea = data.builtArea;
  if (data.currentOccupation !== undefined) dto.currentOccupation = data.currentOccupation;
  if (data.restorationAndHeritage !== undefined) dto.restorationAndHeritage = data.restorationAndHeritage;
  if (data.coordinates?.lat != null || data.coordinates?.lng != null) dto.coordinates = data.coordinates;
  if (data.heritage !== undefined) dto.heritage = data.heritage;
  if (data.history !== undefined) dto.history = data.history;
  if (data.sources !== undefined) dto.sources = (data.sources ?? []).map((s) => s.title ?? String(s));
  if (data.architectId) dto.architectId = data.architectId;
  if (possibleAdvanced.createdById) dto.createdById = possibleAdvanced.createdById;
  if (possibleAdvanced.updatedById) dto.updatedById = possibleAdvanced.updatedById;

  return dto;
}

export async function getBuildings(): Promise<Building[]> {
  try {
    const response = await requestBuildingsApi<Record<string, unknown>[]>('');
    if (!response) {
      return getMockList();
    }

    return response.map((api) => {
      const form = fromApiBuildingToFormData(api);
      return normalizeBuilding({ ...form, id: (api['id'] ?? api['_id'] ?? '') as string, createdAt: api['createdAt'] as Date | undefined, updatedAt: api['updatedAt'] as Date | undefined });
    });
  } catch {
    return getMockList();
  }
}

export async function getBuildingById(id: string): Promise<Building | null> {
  try {
    const response = await requestBuildingsApi<Record<string, unknown>>(`/${id}`);
    if (!response) return null;
    const form = fromApiBuildingToFormData(response);
    return normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? id) as string, createdAt: response['createdAt'] as Date | undefined, updatedAt: response['updatedAt'] as Date | undefined });
  } catch {
    return getMockById(id);
  }
}

export async function createBuilding(data: BuildingFormData): Promise<Building> {
  try {
    const response = await requestBuildingsApi<Record<string, unknown>>('', {
      method: 'POST',
      body: JSON.stringify(fromFormDataToApiDto(data)),
    });

    if (!response) return createMock(data);

    const form = fromApiBuildingToFormData(response);
    const built: Building = normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? '') as string, createdAt: response['createdAt'] as Date | undefined, updatedAt: response['updatedAt'] as Date | undefined });
    return built;
  } catch {
    return createMock(data);
  }
}

export async function updateBuilding(id: string, data: BuildingFormData): Promise<Building> {
  try {
    const response = await requestBuildingsApi<Record<string, unknown>>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(fromFormDataToApiDto(data)),
    });

    if (!response) return updateMock(id, data);

    const form = fromApiBuildingToFormData(response);
    const built: Building = normalizeBuilding({ ...form, id: (response['id'] ?? response['_id'] ?? id) as string, createdAt: response['createdAt'] as Date | undefined, updatedAt: response['updatedAt'] as Date | undefined });
    return built;
  } catch {
    return updateMock(id, data);
  }
}

export async function deleteBuilding(id: string): Promise<void> {
  try {
    await requestBuildingsApi(`/${id}`, {
      method: 'DELETE',
      expectJson: false,
    });
  } catch {
    deleteMock(id);
  }
}
