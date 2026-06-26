import { getPublicRuntimeConfig } from "@/lib/config";
import type {
  LandingData,
  LandingPageApiResponse,
  LandingPageRecord,
} from "../types/landing";

const DEFAULT_LANG = "pt";

function getLandingPageRecord(
  payload: LandingPageApiResponse
): LandingPageRecord | null {
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

type LocalizedValue = string | { pt?: string; en?: string; de?: string };

function getLocalized(value: LocalizedValue | undefined, lang: string): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return value?.[lang as "pt" | "en" | "de"]?.trim() ?? "";
}

function mapLandingPageResponse(data: LandingPageRecord | null, lang = "pt"): LandingData {
  return {
    title: getLocalized(data?.mainTitle, lang),
    description: getLocalized(data?.subtitle, lang),
  };
}

function hasLandingContent(data: LandingData): boolean {
  return Boolean(data.title || data.description);
}

export async function getLandingData(lang = DEFAULT_LANG): Promise<LandingData | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const url = new URL("/landing-page", apiUrl);

  url.searchParams.set("lang", lang);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar a landing page.`);
  }

  const data = mapLandingPageResponse(
    getLandingPageRecord((await response.json()) as LandingPageApiResponse),
    lang
  );

  return hasLandingContent(data) ? data : null;
}
