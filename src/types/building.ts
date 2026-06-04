export interface BuildingImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  fallbackUrl?: string;
}

export interface ImageCategory {
  floorPlan: BuildingImage[];
  facades: BuildingImage[];
  exteriorPhotos: BuildingImage[];
  interiorPhotos: BuildingImage[];
}

export interface BuildingSource {
  id: string;
  title: string;
  author?: string;
  url?: string;
}

export type Building = {
  id: string;
  title: string;
  location: string;
  constructionPeriod?: string;
  architect?: string;
  constructor?: string;
  ornamentsAuthor?: string;
  builtArea?: string;
  currentOccupation?: string;
  restorationAndHeritage?: string;
  heritage?: string;
  description?: string;
  author?: string;
  sources?: BuildingSource[];
  images?: ImageCategory;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BuildingFormData = Omit<Building, 'id' | 'createdAt' | 'updatedAt'>;
