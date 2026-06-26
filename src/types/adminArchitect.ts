export type ArchitectStatus = 'draft' | 'published' | 'archived';

export type ArchitectFormData = {
  status: ArchitectStatus;
  firstName: string;
  lastName: string;
  fullName?: string;
  portraitUrl: string;
  portraitAlt: string;
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
  birthCity: string;
  birthCountry: string;
  deathDay?: number | null;
  deathMonth?: number | null;
  deathYear?: number | null;
  deathCity?: string | null;
  deathCountry?: string | null;
  citizenship: string;
  occupation: string;
  about: string;
  style: string;
  influences: string;
  legacy: string;
};

export type AdminArchitect = ArchitectFormData & {
  id: string;
  slug: string;
  fullName: string;
  buildingsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};
