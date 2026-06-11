export type { Building } from '@/types/building';
import type { Building } from '@/types/building';
import { mapBuildingsMock } from '@/features/map/mocks/map-buildings-mock';

export const buildings: Building[] = mapBuildingsMock.map((building) => ({
  id: String(building.id),
  slug: building.slug,
  title: building.name,
  location: building.district ?? '',
  constructionPeriod: building.yearLabel,
  description: building.summary,
  latitude: building.latitude,
  longitude: building.longitude,
  constructor: building.architectName ?? 'Autor desconhecido', 
}));

export function getBuildingBySlug(slug: string) {
  return (
    buildings.find((building) => building.slug === slug) ??
    buildings.find((building) => building.id === slug)
  );
}
