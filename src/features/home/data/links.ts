import { linksMock } from "../mocks/links-mock";
import type { LinkItem, LinksSection } from "../types/links";

type LocalizedField = {
  pt?: string;
};

type LandingPageRecord = {
  institutionsSection?: {
    title?: LocalizedField;
    institutions?: Array<{
      id?: string;
      title?: LocalizedField;
      description?: LocalizedField;
      CTA?: {
        label?: LocalizedField;
        target?: string;
      };
      order?: number;
    }> | null;
  } | null;
} | null;

type LandingPageResponse = LandingPageRecord | LandingPageRecord[];

function getLandingPageRecord(
  payload: LandingPageResponse,
): LandingPageRecord | null {
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

function mapLinksSection(payload: LandingPageResponse): LinksSection | null {
  const page = getLandingPageRecord(payload);
  const section = page?.institutionsSection;
  const title = section?.title?.pt?.trim() || linksMock.title;

  const items = (section?.institutions ?? [])
    .map((item, index): LinkItem | null => {
      const label = item?.CTA?.label?.pt?.trim() || item?.title?.pt?.trim();
      const href = item?.CTA?.target?.trim();
      const description = item?.description?.pt?.trim();
      const id = item?.id?.trim() || `${href ?? label ?? "link"}-${index}`;

      if (!label || !href) {
        return null;
      }

      return {
        id,
        label,
        href,
        description,
      };
    })
    .filter((item): item is LinkItem => Boolean(item));

  if (!title || items.length === 0) {
    return null;
  }

  return {
    title,
    items,
  };
}

export async function getLinksData(): Promise<LinksSection | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return linksMock;
  }

  try {
    const url = new URL("/landing-page", baseUrl);
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return linksMock;
    }

    const data = (await response.json()) as LandingPageResponse;
    return mapLinksSection(data) ?? null;
  } catch {
    return linksMock;
  }
}