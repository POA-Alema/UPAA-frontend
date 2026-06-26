import { getPublicRuntimeConfig } from "@/lib/config";
import type { ImmigrationSection } from "../types/immigration";

type LocalizedField = {
  pt?: string;
  en?: string;
  de?: string;
};

type LandingPageRecord = {
  immigrationSection?: {
    subtitle?: {
      pt?: string;
    };
    title?: {
      pt?: string;
    };
    content?: {
      pt?: string;
    };
    imageURL?: string;
    imgSubtitle?: LocalizedField;
    image?: {
      src?: string;
      alt?: string;
      title?: string;
      description?: string;
    };
  } | null;
} | null;

type LandingPageResponse = LandingPageRecord | LandingPageRecord[];

function mapImmigrationSection(
  payload: LandingPageResponse,
): ImmigrationSection | null {
  const page = Array.isArray(payload) ? payload[0] : payload;
  const section = page?.immigrationSection;
  const subtitle = section?.subtitle?.pt?.trim();
  const title = section?.title?.pt?.trim();
  const content = section?.content?.pt?.trim();

  if (!title || !content) {
    return null;
  }

  const imageSrc =
    section?.image?.src?.trim() || section?.imageURL?.trim();
  const imageAlt =
    section?.image?.alt?.trim() || section?.imgSubtitle?.pt?.trim();

  return {
    subtitle,
    title,
    content,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageAlt || title,
          title: section?.image?.title,
          description: section?.image?.description,
        }
      : undefined,
  };
}

export async function getImmigrationData(): Promise<ImmigrationSection | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const url = new URL("/landing-page", apiUrl);

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar a secao de imigracao.`);
  }

  const data: LandingPageResponse = await response.json();
  return mapImmigrationSection(data);
}
