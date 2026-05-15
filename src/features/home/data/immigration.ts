import { immigrationMock } from "../mocks/immigration-mock";
import type { ImmigrationSection } from "../types/immigration";

type LocalizedField = {
  pt?: string;
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
        }
      : undefined,
  };
}

export async function getImmigrationData(): Promise<ImmigrationSection> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return immigrationMock;
  }

  try {
    const response = await fetch(`${baseUrl}/landing-page`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return immigrationMock;
    }

    const data: LandingPageResponse = await response.json();
    return mapImmigrationSection(data) ?? immigrationMock;
  } catch {
    return immigrationMock;
  }
}
