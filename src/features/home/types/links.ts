export type LinkItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
};

export type LinksSection = {
  title: string;
  items: LinkItem[];
};