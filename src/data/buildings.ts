export type Building = {
  slug: string;
  title: string;
  district: string;
  yearLabel: string;
  summary: string;
};

// TODO: Implement dynamic data fetching for buildings from CMS or API
export const buildings: Building[] = [
  {
    slug: 'edificacao-exemplo-1',
    title: 'Edificação 1',
    district: 'Centro Histórico',
    yearLabel: 'Ano',
    summary: 'Descrição'
  },
  {
    slug: 'edificacao-exemplo-2',
    title: 'Edificação 2',
    district: 'Moinhos de Vento',
    yearLabel: 'Ano',
    summary: 'Descrição'
  },
  {
    slug: 'edificacao-exemplo-3',
    title: 'Edificação 3',
    district: 'Cidade Baixa',
    yearLabel: 'Ano',
    summary: 'Descrição'
  }
];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}
