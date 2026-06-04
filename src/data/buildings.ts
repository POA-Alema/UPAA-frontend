export type { Building } from '@/types/building';
import type { Building } from '@/types/building';

export const buildings: Building[] = [];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.title === slug);
}
