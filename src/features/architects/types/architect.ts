export interface ArchitectBioProps {
  eyebrow?: string;
  title: string;
  bio: string;
  image?: {
    src: string;
    alt: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  details?: {
    label: string;
    value: string;
    subValue?: string;
  }[];
}
