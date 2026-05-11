import { getPublicRuntimeConfig } from "@/lib/config";
import { landingMock } from "../mocks/landing-mock";
import type { LandingData, LandingPageApiResponse } from "../types/landing";

const DEFAULT_LANG = "pt";

function mapLandingPageResponse(data: LandingPageApiResponse): LandingData {
  return {
    title: data.mainTitle?.trim() ?? "",
    description: data.subtitle?.trim() ?? "",
  };
}

function hasLandingContent(data: LandingData): boolean {
  return Boolean(data.title || data.description);
}

export async function getLandingData(lang = DEFAULT_LANG): Promise<LandingData> {
  try {
    const { apiUrl } = getPublicRuntimeConfig();
    const url = new URL("/landingPage", apiUrl);

    url.searchParams.set("lang", lang);

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return landingMock;
    }

    const data = mapLandingPageResponse(
      (await response.json()) as LandingPageApiResponse
    );

    return hasLandingContent(data) ? data : landingMock;
  } catch {
    return landingMock;
  }
}
