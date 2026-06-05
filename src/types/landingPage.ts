export interface MultilingualText {
  pt: string;
  en?: string;
  de?: string;
}

export interface CTAInfo {
  label: MultilingualText;
  target: string;
  icon?: string;
}

export interface ArchitectSection {
  imageURL: string;
  imageSubtitle?: MultilingualText;
  title: MultilingualText;
  subtitle?: MultilingualText;
  content: MultilingualText;
  CTA: CTAInfo;
  order: number;
}

export interface ImmigrationSection {
  imageURL?: string;
  imgSubtitle?: MultilingualText;
  title: MultilingualText;
  subtitle?: MultilingualText;
  content: MultilingualText;
  order: number;
}

export interface InstitutionItem {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  CTA: CTAInfo;
  imageURL?: string;
  order: number;
}

export interface InstitutionsSection {
  title: MultilingualText;
  institutions: InstitutionItem[];
}

export interface LandingPageData {
  id?: string;
  mainTitle: MultilingualText;
  subtitle: MultilingualText;
  architectSection: ArchitectSection;
  immigrationSection?: ImmigrationSection;
  institutionsSection: InstitutionsSection;
  updatedAt?: string;
}
