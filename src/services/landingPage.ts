import { getPublicRuntimeConfig } from '@/lib/config';
import { getAuthHeader } from '@/lib/auth-storage';
import type { LandingPageData } from '@/types/landingPage';

const API_TIMEOUT_MS = 5000;

type LandingPageApiData = Partial<LandingPageData> & {
  _id?: string;
};

function getLandingPageRecord(payload: unknown): LandingPageApiData | null {
  const data = Array.isArray(payload) ? payload[0] : payload;
  return data && typeof data === 'object' ? data as LandingPageApiData : null;
}

function normalizeLandingPageData(data: LandingPageApiData | null): LandingPageData {
  if (!data) {
    throw new Error('Backend nao retornou dados da landing page.');
  }

  if (!data.mainTitle || !data.subtitle || !data.architectSection || !data.institutionsSection) {
    throw new Error('Backend retornou dados incompletos da landing page.');
  }

  return {
    id: data.id || data._id,
    mainTitle: data.mainTitle,
    subtitle: data.subtitle,
    architectSection: data.architectSection,
    immigrationSection: data.immigrationSection,
    institutionsSection: data.institutionsSection,
    updatedAt: data.updatedAt,
  };
}

async function getResponseMessage(response: Response): Promise<string> {
  const bodyText = await response.text();
  if (!bodyText) {
    return `Erro ${response.status}`;
  }

  try {
    const json = JSON.parse(bodyText) as { message?: unknown };
    if (Array.isArray(json.message)) {
      return json.message.join('; ');
    }
    if (typeof json.message === 'string') {
      return json.message;
    }
  } catch {
    // Use the raw body below.
  }

  return bodyText;
}

export async function getLandingPageData(): Promise<LandingPageData> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const url = `${baseUrl}/landing-page`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return normalizeLandingPageData(getLandingPageRecord(await response.json()));
}

export async function updateLandingPageData(data: LandingPageData): Promise<LandingPageData> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const id = data.id;
  const url = id ? `${baseUrl}/landing-page/${id}` : `${baseUrl}/landing-page`;
  const method = id ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return normalizeLandingPageData(getLandingPageRecord(await response.json()));
}
