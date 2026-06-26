import { getLinksMock } from "../mocks/links-mock";
import type { LinkItem, LinksSection } from "../types/links";

const DEFAULT_LINKS_LIMIT = 2;

type LocalizedField = {
  pt?: string;
  en?: string;
  de?: string;
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

function isExternalLink(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function getLocalizedText(field: LocalizedField | undefined, lang: string): string {
  const language = lang === "en" || lang === "de" ? lang : "pt";
  return field?.[language]?.trim() || field?.pt?.trim() || "";
}

function mapLinksSection(payload: LandingPageResponse, lang: string): LinksSection | null {
  const page = getLandingPageRecord(payload);
  const section = page?.institutionsSection;
  const fallback = getLinksMock(lang);
  const title = fallback.title;

  const items = [...(section?.institutions ?? [])]
    .sort((first, second) => (first?.order ?? 0) - (second?.order ?? 0))
    .map((item, index): LinkItem | null => {
      const label =
        getLocalizedText(item?.title, lang) ||
        getLocalizedText(item?.CTA?.label, lang);
      const href = item?.CTA?.target?.trim();
      const description = getLocalizedText(item?.description, lang);
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
    .filter(
      (item): item is LinkItem => item !== null && isExternalLink(item.href),
    )
    .slice(0, DEFAULT_LINKS_LIMIT);

  if (items.length === 0) {
    return fallback;
  }

  return {
    title,
    items,
  };
}

export async function getLinksData(lang = "pt"): Promise<LinksSection | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return getLinksMock(lang);
  }

  try {
    const url = new URL("/landing-page", baseUrl);
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getLinksMock(lang);
    }

    const data = (await response.json()) as LandingPageResponse;
    return mapLinksSection(data, lang) ?? null;
  } catch {
    return getLinksMock(lang);
  }
}
