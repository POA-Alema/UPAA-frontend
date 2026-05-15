import { landingMock } from "../mocks/landing-mock";
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

function mapLandingPageResponse(data: LandingPageRecord | null): LandingData {
  return {
    title: data?.mainTitle?.pt?.trim() ?? "",
    description: data?.subtitle?.pt?.trim() ?? "",
  };
}

function hasLandingContent(data: LandingData): boolean {
  return Boolean(data.title || data.description);
}

export async function getLandingData(lang = DEFAULT_LANG): Promise<LandingData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return landingMock;
  }

  try {
    const url = new URL("/landing-page", baseUrl);

    url.searchParams.set("lang", lang);

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return landingMock;
    }

    const data = mapLandingPageResponse(
      getLandingPageRecord((await response.json()) as LandingPageApiResponse)
    );

    return hasLandingContent(data) ? data : landingMock;
  } catch {
    return landingMock;
  }
}
