import { getPublicRuntimeConfig } from '@/lib/config';
import type {
  ImageCategory,
  Building,
  BuildingFormData,
  BuildingImage,
  BuildingMaterial,
} from '@/types/building';

const ENDPOINT_CANDIDATES = [
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
      materials: [
        {
          id: 'margs-material-planta-1',
          type: 'plant',
          title: 'Planta baixa',
          description: 'Levantamento grafico da organizacao interna.',
        },
        {
          id: 'margs-material-documento-1',
          type: 'document',
          title: 'Documento historico',
          description: 'Registro documental associado ao edificio.',
        },
        {
          id: 'margs-material-analise-1',
          type: 'analysis',
          title: 'Analise arquitetonica',
          description: 'Sintese visual de elementos formais e patrimoniais.',
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
      materials: [],
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
    materials: (building.materials ?? []).map(normalizeMaterial),
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
        continue;
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
    const response = await requestBuildingsApi<Building>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response ? normalizeBuilding(response) : createMock(data);
  } catch {
    return createMock(data);
  }
}

export async function updateBuilding(id: string, data: BuildingFormData): Promise<Building> {
  try {
    const response = await requestBuildingsApi<Building>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response ? normalizeBuilding(response) : updateMock(id, data);
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
