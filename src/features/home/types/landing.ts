export type LandingData = {
  title: string;
  description: string;
};

type LocalizedMap = {
  pt?: string;
  en?: string;
  de?: string;
};

type LocalizedField = string | LocalizedMap;

export type LandingPageRecord = {
  id?: string;
  mainTitle?: LocalizedField;
  subtitle?: LocalizedField;
  updatedAt?: string;
  updated_at?: string;
};

export type LandingPageApiResponse = LandingPageRecord | LandingPageRecord[];
