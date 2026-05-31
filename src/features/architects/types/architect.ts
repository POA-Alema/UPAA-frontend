export interface ArchitectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ArchitectDetail {
  label: string;
  value: string;
  subValue?: string;
}

export interface ArchitectAction {
  label: string;
  href?: string;
}

export interface ArchitectCharacteristic {
  icon: string;
  title: string;
  description: string;
}

export interface ArchitectWork {
  title: string;
  image?: ArchitectImage;
  href?: string;
}

export interface Architect {
  id: string;
  slug: string;
  eyebrow?: string;
  title: string;
  bioSummary: string;
  bio: string;
  image?: ArchitectImage;
  actions?: {
    primary?: ArchitectAction;
    secondary?: ArchitectAction;
  };
  details?: ArchitectDetail[];
  characteristics?: ArchitectCharacteristic[];
  works?: ArchitectWork[];
  ctaDescription?: string;
}

export interface ArchitectPreviewProps {
  architect: Architect;
}

export interface ArchitectPageProps {
  architect: Architect;
  backToMapHref?: string;
}
