export type Building = {
  id: number;
  name: string;
  slug?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
};

export type MapMarker = {
  id: number;
  name: string;
  slug?: string;
  district?: string;
  position: [number, number];
};

export function mapBuildingsToMarkers(buildings: Building[]): MapMarker[] {
  return buildings
    .filter((b) => b.latitude != null && b.longitude != null)
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      district: b.district,
      position: [b.latitude!, b.longitude!],
    }));
}
