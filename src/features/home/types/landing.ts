export type LandingData = {
  title: string;
  description: string;
};

type LocalizedField = {
  pt?: string;
};

export type LandingPageRecord = {
  id?: string;
  mainTitle?: LocalizedField;
  subtitle?: LocalizedField;
  updatedAt?: string;
  updated_at?: string;
};

export type LandingPageApiResponse = LandingPageRecord | LandingPageRecord[];
