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

function normalizeImage(image: Partial<BuildingImage>, index: number): BuildingImage {
  return {
    id: image.id ?? `image-${index + 1}`,
    url: image.url ?? image.fallbackUrl ?? '/images/Margs.jpg',
    fallbackUrl: image.fallbackUrl,
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
    constructionPeriod: building.constructionPeriod,
    architect: building.architect,
    constructor: building.constructor,
    ornamentsAuthor: building.ornamentsAuthor,
    builtArea: building.builtArea,
    currentOccupation: building.currentOccupation,
    restorationAndHeritage: building.restorationAndHeritage,
    heritage: building.heritage,
    description: building.description,
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

    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        // try to extract message from the body, then throw so callers can fall back
        try {
          const bodyText = await response.text();
          let msg = bodyText;
          try {
            const json = JSON.parse(bodyText);
            msg = json.message || JSON.stringify(json);
          } catch {
            // ignore
          }
          throw new Error(`API error ${response.status}: ${msg}`);
        } catch (err) {
          throw err;
        }
      }

      if (init?.expectJson === false || response.status === 204) {
        return null;
      }

      return (await response.json()) as T;
    } catch {
      continue;
    }
  }

  throw new Error('Nenhum endpoint de edificações respondeu com sucesso.');
}

/* Adapters: map API <-> FormData (best-effort)
   These provide a bridge between the frontend form shape and the backend API shape.
*/
function mapMediaGalleryToImages(mediaGallery: any[] | undefined) {
  const result = {
    floorPlan: [] as BuildingImage[],
    facades: [] as BuildingImage[],
    exteriorPhotos: [] as BuildingImage[],
    interiorPhotos: [] as BuildingImage[],
  };

  if (!Array.isArray(mediaGallery)) return result;

  for (const item of mediaGallery) {
    const img = normalizeImage({ id: item.id ?? item.url ?? '', url: item.url ?? item.path, alt: item.alt ?? '' }, 0);
    const type = (item.type || '').toLowerCase();
    if (type.includes('planta') || type.includes('floor')) result.floorPlan.push(img);
    else if (type.includes('fachada') || type.includes('facade')) result.facades.push(img);
    else if (type.includes('interna') || type.includes('interior')) result.interiorPhotos.push(img);
    else result.exteriorPhotos.push(img);
  }

  return result;
}

function mapImagesToMediaGallery(images?: ImageCategory | null) {
  const out: any[] = [];
  if (!images) return out;

  const push = (list: BuildingImage[], type: string) => {
    for (const img of list) {
      out.push({ id: img.id, url: img.url, alt: img.alt, caption: img.caption, type });
    }
  };

  push(images.floorPlan ?? [], 'planta_baixa');
  push(images.facades ?? [], 'fachada');
  push(images.interiorPhotos ?? [], 'interna');
  push(images.exteriorPhotos ?? [], 'externa');

  return out;
}

function fromApiBuildingToFormData(api: any): BuildingFormData {
  const title = api?.name?.pt ?? api?.name ?? api?.title ?? '';
  const location = api?.location?.pt ?? api?.location ?? '';
  const description = api?.description?.pt ?? api?.description ?? '';
  const sources = Array.isArray(api?.sources)
    ? api.sources.map((s: any, i: number) => ({ id: s.id ?? `s-${i}`, title: s.title ?? String(s), author: s.author, url: s.url }))
    : [];

  return {
    title,
    location,
    description,
    constructionPeriod: api?.constructionPeriod,
    architect: api?.architect?.name ?? api?.architect ?? api?.architectId,
    constructor: api?.constructor,
    ornamentsAuthor: api?.ornamentsAuthor,
    builtArea: api?.builtArea,
    currentOccupation: api?.currentOccupation,
    restorationAndHeritage: api?.restorationAndHeritage,
    heritage: api?.heritage,
    author: api?.author,
    sources,
    images: mapMediaGalleryToImages(api?.mediaGallery),
  };
}

function fromFormDataToApiDto(data: BuildingFormData) {
  // Only include fields the user provided. Do NOT fabricate DB ids or audit fields.
  const imagesUrls = [] as string[];
  if (data.images) {
    imagesUrls.push(...((data.images.floorPlan ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.facades ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.exteriorPhotos ?? []).map((i) => i.url) as string[]));
    imagesUrls.push(...((data.images.interiorPhotos ?? []).map((i) => i.url) as string[]));
  }

  const dto: Record<string, unknown> = {};

  if (data.title !== undefined) dto.title = data.title;
  if (data.description !== undefined) dto.description = data.description;
  if (data.author !== undefined) dto.author = data.author;
  if (imagesUrls.length > 0) dto.images = imagesUrls;
  if (data.location !== undefined) dto.location = data.location;
  if (data.constructionPeriod !== undefined) dto.constructionPeriod = data.constructionPeriod;
  if (data.ornamentsAuthor !== undefined) dto.ornamentsAuthor = data.ornamentsAuthor;
  if (data.builtArea !== undefined) dto.builtArea = data.builtArea;
  if (data.currentOccupation !== undefined) dto.currentOccupation = data.currentOccupation;
  if (data.restorationAndHeritage !== undefined) dto.restorationAndHeritage = data.restorationAndHeritage;
  if (data.heritage !== undefined) dto.heritage = data.heritage;
  if (data.sources !== undefined) dto.sources = (data.sources ?? []).map((s) => s.title ?? String(s));

  // advanced/front-provided optional fields: include only when user explicitly provided them
  // (BuildingForm stores them in meta and merges before calling service)
  // supported keys: slug, qrCodeKey, architectId, coordinates, history, createdById, updatedById
  const possibleAdvanced = (data as any) as Record<string, unknown>;
  if (possibleAdvanced.slug) dto.slug = possibleAdvanced.slug;
  if (possibleAdvanced.qrCodeKey) dto.qrCodeKey = possibleAdvanced.qrCodeKey;
  if (possibleAdvanced.architectId) dto.architectId = possibleAdvanced.architectId;
  if (possibleAdvanced.coordinates) dto.coordinates = possibleAdvanced.coordinates;
  if (possibleAdvanced.history) dto.history = possibleAdvanced.history;
  if (possibleAdvanced.createdById) dto.createdById = possibleAdvanced.createdById;
  if (possibleAdvanced.updatedById) dto.updatedById = possibleAdvanced.updatedById;

  return dto;
}

export async function getBuildings(): Promise<Building[]> {
  try {
    const response = await requestBuildingsApi<Building[]>('');
    if (!response) {
      return getMockList();
    }

    return response.map(normalizeBuilding);
  } catch {
    return getMockList();
  }
}

export async function getBuildingById(id: string): Promise<Building | null> {
  try {
    const response = await requestBuildingsApi<Building>(`/${id}`);
    return response ? normalizeBuilding(response) : null;
  } catch {
    return getMockById(id);
  }
}

export async function createBuilding(data: BuildingFormData): Promise<Building> {
  try {
    const response = await requestBuildingsApi<any>('', {
      method: 'POST',
      body: JSON.stringify(fromFormDataToApiDto(data)),
    });

    if (!response) return createMock(data);

    const form = fromApiBuildingToFormData(response);
    const built: Building = normalizeBuilding({ ...form, id: response.id ?? response._id ?? '', createdAt: response.createdAt, updatedAt: response.updatedAt });
    return built;
  } catch {
    return createMock(data);
  }
}

export async function updateBuilding(id: string, data: BuildingFormData): Promise<Building> {
  try {
    const response = await requestBuildingsApi<any>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(fromFormDataToApiDto(data)),
    });

    if (!response) return updateMock(id, data);

    const form = fromApiBuildingToFormData(response);
    const built: Building = normalizeBuilding({ ...form, id: response.id ?? response._id ?? id, createdAt: response.createdAt, updatedAt: response.updatedAt });
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
