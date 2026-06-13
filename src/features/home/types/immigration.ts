import type { ImageMetadata } from "@/types/image";

export type ImmigrationSection = {
  subtitle?: string;
  title: string;
  content: string;
  image?: ImageMetadata & {
    src: string;
    alt: string;
  };
};
