export type BuildingAttachment = {
  src: string;
  alt: string;
  caption?: string;
};

export type Building = {
  id: number;
  name: string;
  slug?: string;
  district?: string;
  summary?: string;
  yearLabel?: string;
  architectName?: string;
  architectPath?: string;
  attachments?: BuildingAttachment[];
  latitude?: number;
  longitude?: number;
};

export type MapMarker = {
  id: number;
  name: string;
  slug?: string;
  district?: string;
  summary?: string;
  yearLabel?: string;
  architectName?: string;
  routePath?: string;
  architectPath?: string;
  attachments: BuildingAttachment[];
  position: [number, number];
};

export function buildBuildingDetailPath(slug: string) {
  return `/buildings/${slug}`;
}

export function mapBuildingsToMarkers(buildings: Building[]): MapMarker[] {
  return buildings
    .filter((b) => b.latitude != null && b.longitude != null)
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      district: b.district,
      summary: b.summary,
      yearLabel: b.yearLabel,
      architectName: b.architectName,
      routePath: b.slug ? buildBuildingDetailPath(b.slug) : undefined,
      architectPath: b.architectPath,
      attachments: b.attachments ?? [],
      position: [b.latitude!, b.longitude!],
    }));
}
