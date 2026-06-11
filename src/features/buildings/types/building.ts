export interface BuildingImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface BuildingTechnicalSpec {
  label: string;
  value: string;
}

export interface BuildingCharacteristic {
  icon: string;
  title: string;
  description: string;
}

export interface BuildingAction {
  label: string;
  href?: string;
}

export interface BuildingArchitectCta {
  description: string;
  label: string;
  href?: string;
}

export interface Building {
  id: string;
  slug: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  summary: string;
  hero?: BuildingImage;
  history: string;
  technicalSpecs?: BuildingTechnicalSpec[];
  characteristics?: BuildingCharacteristic[];
  gallery?: BuildingImage[];
  architectCta?: BuildingArchitectCta;
  actions?: {
    backToMap?: BuildingAction;
  };
}

export interface BuildingPageProps {
  building: Building;
  backToMapHref?: string;
  language?: "pt" | "en" | "de";
}
