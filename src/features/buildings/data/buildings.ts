import { buildingsMock } from "../mocks/building-mock";
import type { Building } from "../types/building";

export async function listBuildings(): Promise<Building[]> {
  return buildingsMock;
}

export async function getBuildingBySlug(slug: string): Promise<Building | null> {
  const buildings = await listBuildings();
  return buildings.find((building) => building.slug === slug) ?? null;
}

export async function getFeaturedBuilding(): Promise<Building | null> {
  const buildings = await listBuildings();
  return buildings[0] ?? null;
}
