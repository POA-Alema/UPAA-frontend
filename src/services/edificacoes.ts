import { getPublicRuntimeConfig } from '@/lib/config';
import type { CategoriaImagens, Edificacao, EdificacaoFormData, ImagemEdificacao } from '@/types/edificacao';

const ENDPOINT_CANDIDATES = [
  '/admin/edificacoes',
  '/api/admin/edificacoes',
  '/edificacoes',
] as const;

function buildBackendImageUrl(path: string): string {
  const { apiUrl } = getPublicRuntimeConfig();
  return `${apiUrl.replace(/\/$/, '')}${path}`;
}

function createMockImage(
  id: string,
  path: string,
  fallbackUrl: string,
  alt: string,
  legenda?: string
): ImagemEdificacao {
  return {
    id,
    url: buildBackendImageUrl(path),
    fallbackUrl,
    alt,
    legenda,
  };
}

function createMockEdificacoes(): Edificacao[] {
  return [
    {
      id: '1',
      titulo: 'Museu de Arte do Rio Grande do Sul Ado Malagoli',
      localizacao: 'Praça da Alfândega, Centro Histórico, Porto Alegre, RS',
      data: '1913',
      projeto: 'Theo Wiederspahn',
      construcao: '1910-1913',
      ornamentosEsculturas: 'Fachada eclética com repertório clássico, pilastras e elementos escultóricos.',
      areaConstituida: 'Aproximadamente 5.000 m²',
      ocupacaoAtual: 'Museu de arte',
      projetoRestauracao: 'Conservação preventiva e adequações internas para uso museológico.',
      tombamento: 'Integrante do conjunto histórico da Praça da Alfândega.',
      descricao:
        '<p>Edificação emblemática do Centro Histórico de Porto Alegre, com forte presença institucional e valor arquitetônico. O prédio hoje abriga o MARGS e se destaca pela imponência da fachada e pela relação com o conjunto urbano da praça.</p><p>O cadastro administrativo contempla campos descritivos, fontes dinâmicas e imagens organizadas por categoria.</p>',
      autor: 'Theo Wiederspahn',
      fontes: [
        {
          id: 'fonte-margs-1',
          titulo: 'Acervo institucional do MARGS',
          autor: 'MARGS',
          url: 'https://www.margs.rs.gov.br/',
        },
        {
          id: 'fonte-margs-2',
          titulo: 'Levantamento arquitetônico preliminar',
          autor: 'Equipe UPAA',
        },
      ],
      imagens: {
        plantaBaixa: [
          createMockImage(
            'margs-planta-1',
            '/images/edificacoes/margs/planta-baixa.jpg',
            '/images/Margs.jpg',
            'Vista de apoio do MARGS na categoria planta baixa.',
            'Imagem de referência da categoria Planta baixa.'
          ),
        ],
        fachadas: [
          createMockImage(
            'margs-fachada-1',
            '/images/edificacoes/margs/fachada-principal.jpg',
            '/images/Margs.jpg',
            'Fachada principal do MARGS.',
            'Imagem principal da fachada do edifício.'
          ),
        ],
        fotosExternas: [
          createMockImage(
            'margs-externa-1',
            '/images/edificacoes/margs/foto-externa.jpg',
            '/images/Margs.jpg',
            'Registro externo do Museu de Arte do Rio Grande do Sul.',
            'Imagem de referência da categoria Fotos externas.'
          ),
        ],
        fotosInternas: [],
      },
      criadoEm: new Date('2024-01-01'),
      atualizadoEm: new Date('2024-01-01'),
    },
    {
      id: '2',
      titulo: 'Memorial do Rio Grande do Sul',
      localizacao: 'Praça da Alfândega, Centro Histórico, Porto Alegre, RS',
      data: '1912',
      projeto: 'Theo Wiederspahn',
      construcao: 'Início do século XX',
      ornamentosEsculturas: 'Composição eclética com detalhes ornamentais e ritmo vertical nas aberturas.',
      areaConstituida: 'Aproximadamente 3.800 m²',
      ocupacaoAtual: 'Centro cultural e espaço expositivo',
      projetoRestauracao: 'Requalificações para uso cultural e expográfico.',
      tombamento: 'Bem de interesse histórico e cultural do conjunto da praça.',
      descricao:
        '<p>O Memorial do Rio Grande do Sul ocupa um edifício de linguagem eclética associado à memória institucional do estado. Sua implantação ajuda a consolidar o caráter cívico do entorno.</p><p>O cadastro reúne informações históricas, campos administrativos e imagens organizadas por categoria.</p>',
      autor: 'Theo Wiederspahn',
      fontes: [
        {
          id: 'fonte-memorial-1',
          titulo: 'Portal institucional do Memorial RS',
          autor: 'Memorial RS',
        },
        {
          id: 'fonte-memorial-2',
          titulo: 'Registro fotográfico do edifício',
          autor: 'Equipe UPAA',
        },
      ],
      imagens: {
        plantaBaixa: [],
        fachadas: [
          createMockImage(
            'memorial-fachada-1',
            '/images/edificacoes/memorial-rs/fachada-principal.jpg',
            '/images/Memorial RS.jpg',
            'Fachada principal do Memorial do Rio Grande do Sul.',
            'Imagem principal da categoria Fachadas.'
          ),
        ],
        fotosExternas: [
          createMockImage(
            'memorial-externa-1',
            '/images/edificacoes/memorial-rs/foto-externa.jpg',
            '/images/Memorial RS.jpg',
            'Vista externa do Memorial do Rio Grande do Sul.',
            'Imagem de referência da categoria Fotos externas.'
          ),
        ],
        fotosInternas: [
          createMockImage(
            'memorial-interna-1',
            '/images/edificacoes/memorial-rs/foto-interna.jpg',
            '/images/Memorial RS.jpg',
            'Imagem de apoio do Memorial RS na categoria fotos internas.',
            'Imagem de referência da categoria Fotos internas.'
          ),
        ],
      },
      criadoEm: new Date('2024-01-01'),
      atualizadoEm: new Date('2024-01-01'),
    },
  ];
}

const mockEdificacoes: Edificacao[] = createMockEdificacoes();
let nextId = mockEdificacoes.length + 1;

function normalizeImage(image: Partial<ImagemEdificacao>, index: number): ImagemEdificacao {
  return {
    id: image.id ?? `imagem-${index + 1}`,
    url: image.url ?? image.fallbackUrl ?? '/images/Margs.jpg',
    fallbackUrl: image.fallbackUrl,
    alt: image.alt ?? 'Imagem da edificação',
    legenda: image.legenda,
  };
}

function normalizeImages(categorias?: Partial<CategoriaImagens> | null): CategoriaImagens {
  return {
    plantaBaixa: (categorias?.plantaBaixa ?? []).map(normalizeImage),
    fachadas: (categorias?.fachadas ?? []).map(normalizeImage),
    fotosExternas: (categorias?.fotosExternas ?? []).map(normalizeImage),
    fotosInternas: (categorias?.fotosInternas ?? []).map(normalizeImage),
  };
}

function normalizeEdificacao(edificacao: Partial<Edificacao>): Edificacao {
  return {
    id: edificacao.id ?? '',
    titulo: edificacao.titulo ?? '',
    localizacao: edificacao.localizacao ?? '',
    data: edificacao.data,
    projeto: edificacao.projeto,
    construcao: edificacao.construcao,
    ornamentosEsculturas: edificacao.ornamentosEsculturas,
    areaConstituida: edificacao.areaConstituida,
    ocupacaoAtual: edificacao.ocupacaoAtual,
    projetoRestauracao: edificacao.projetoRestauracao,
    tombamento: edificacao.tombamento,
    descricao: edificacao.descricao,
    autor: edificacao.autor,
    fontes: edificacao.fontes ?? [],
    imagens: normalizeImages(edificacao.imagens),
    criadoEm: edificacao.criadoEm ? new Date(edificacao.criadoEm) : undefined,
    atualizadoEm: edificacao.atualizadoEm ? new Date(edificacao.atualizadoEm) : undefined,
  };
}

function cloneEdificacao(edificacao: Edificacao): Edificacao {
  return normalizeEdificacao(structuredClone(edificacao));
}

function getMockList(): Edificacao[] {
  return mockEdificacoes.map(cloneEdificacao);
}

function getMockById(id: string): Edificacao | null {
  const found = mockEdificacoes.find((item) => item.id === id);
  return found ? cloneEdificacao(found) : null;
}

function createMock(data: EdificacaoFormData): Edificacao {
  const novaEdificacao = normalizeEdificacao({
    ...data,
    id: String(nextId++),
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  });

  mockEdificacoes.push(novaEdificacao);
  return cloneEdificacao(novaEdificacao);
}

function updateMock(id: string, data: EdificacaoFormData): Edificacao {
  const index = mockEdificacoes.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Edificação com ID ${id} não encontrada`);
  }

  const atualizada = normalizeEdificacao({
    ...mockEdificacoes[index],
    ...data,
    id,
    criadoEm: mockEdificacoes[index].criadoEm,
    atualizadoEm: new Date(),
  });

  mockEdificacoes[index] = atualizada;
  return cloneEdificacao(atualizada);
}

function deleteMock(id: string): void {
  const index = mockEdificacoes.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Edificação com ID ${id} não encontrada`);
  }

  mockEdificacoes.splice(index, 1);
}

async function requestEdificacoesApi<T>(
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

export async function getEdificacoes(): Promise<Edificacao[]> {
  try {
    const response = await requestEdificacoesApi<Edificacao[]>('');
    if (!response) {
      return getMockList();
    }

    return response.map(normalizeEdificacao);
  } catch {
    return getMockList();
  }
}

export async function getEdificacaoById(id: string): Promise<Edificacao | null> {
  try {
    const response = await requestEdificacoesApi<Edificacao>(`/${id}`);
    return response ? normalizeEdificacao(response) : null;
  } catch {
    return getMockById(id);
  }
}

export async function createEdificacao(data: EdificacaoFormData): Promise<Edificacao> {
  try {
    const response = await requestEdificacoesApi<Edificacao>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response ? normalizeEdificacao(response) : createMock(data);
  } catch {
    return createMock(data);
  }
}

export async function updateEdificacao(id: string, data: EdificacaoFormData): Promise<Edificacao> {
  try {
    const response = await requestEdificacoesApi<Edificacao>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response ? normalizeEdificacao(response) : updateMock(id, data);
  } catch {
    return updateMock(id, data);
  }
}

export async function deleteEdificacao(id: string): Promise<void> {
  try {
    await requestEdificacoesApi(`/${id}`, {
      method: 'DELETE',
      expectJson: false,
    });
  } catch {
    deleteMock(id);
  }
}
