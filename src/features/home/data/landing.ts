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

function mapLandingPageResponse(data: LandingPageRecord | null, lang = "pt"): LandingData {
  const l = lang as keyof NonNullable<LandingPageRecord["mainTitle"]>;
  return {
    title: data?.mainTitle?.[l]?.trim() ?? "",
    description: data?.subtitle?.[l]?.trim() ?? "",
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
    next: { revalidate: 3600 },
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
