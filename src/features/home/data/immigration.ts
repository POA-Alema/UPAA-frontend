import { getPublicRuntimeConfig } from "@/lib/config";
import type { ImmigrationSection } from "../types/immigration";

type LocalizedField = {
  pt?: string;
  en?: string;
  de?: string;
} | string;

type LandingPageRecord = {
  immigrationSection?: {
    subtitle?: LocalizedField;
    title?: LocalizedField;
    content?: LocalizedField;
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

function getLocalized(field: LocalizedField | undefined, lang = "pt"): string | undefined {
  if (typeof field === "string") {
    return field.trim();
  }

  return field?.[lang as "pt" | "en" | "de"]?.trim();
}

function mapImmigrationSection(
  payload: LandingPageResponse,
  lang = "pt",
): ImmigrationSection | null {
  const page = Array.isArray(payload) ? payload[0] : payload;
  const section = page?.immigrationSection;
  const subtitle = getLocalized(section?.subtitle, lang);
  const title = getLocalized(section?.title, lang);
  const content = getLocalized(section?.content, lang);

  if (!title || !content) {
    return null;
  }

  const imageSrc =
    section?.image?.src?.trim() || section?.imageURL?.trim();
  const imageAlt =
    section?.image?.alt?.trim() || getLocalized(section?.imgSubtitle, lang);

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

export async function getImmigrationData(lang = "pt"): Promise<ImmigrationSection | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const url = new URL("/landing-page", apiUrl);
  url.searchParams.set("lang", lang);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar a secao de imigracao.`);
  }

  const data: LandingPageResponse = await response.json();
  return mapImmigrationSection(data, lang);
}
