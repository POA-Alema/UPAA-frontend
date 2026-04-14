export type Building = {
  slug: string;
  title: string;
  district: string;
  yearLabel: string;
  summary: string;
};

export const buildings: Building[] = [];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}
