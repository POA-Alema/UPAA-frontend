export type Building = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

export type MapMarker = {
  id: number;
  name: string;
  position: [number, number];
};

export function mapBuildingsToMarkers(
  buildings: Building[]
): MapMarker[] {
  return buildings
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      name: b.name,
      position: [b.latitude!, b.longitude!],
    }));
}