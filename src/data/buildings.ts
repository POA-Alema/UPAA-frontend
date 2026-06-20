export type { Building } from '@/types/building';
import type { Building } from '@/types/building';

export const buildings: Building[] = [
  {
    id: 'margs',
    title: 'Museu de Arte do Rio Grande do Sul (MARGS)',
    location: 'Praca da Alfandega, Centro Historico, Porto Alegre, RS',
    constructionPeriod: '1912',
    constructor: undefined,
    architect: 'Theodor Wiederspahn',
    description:
      'Edificacao historica de referencia no Centro Historico de Porto Alegre.',
    materials: [
      {
        id: 'margs-planta-baixa',
        type: 'plant',
        title: 'Planta baixa',
        description: 'Material grafico de apoio para leitura espacial.',
      },
      {
        id: 'margs-documento-historico',
        type: 'document',
        title: 'Documento historico',
        description: 'Registro documental complementar da edificacao.',
      },
      {
        id: 'margs-analise-arquitetonica',
        type: 'analysis',
        title: 'Analise arquitetonica',
        description: 'Sintese de leitura formal, historica e patrimonial.',
      },
    ],
  },
  {
    id: 'sem-materiais',
    title: 'Edificacao sem materiais',
    location: 'Porto Alegre, RS',
    constructionPeriod: 'Seculo XX',
    constructor: undefined,
    description: 'Registro usado para validar o estado vazio da secao.',
    materials: [],
  },
];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.id === slug || building.title === slug);
}
