import { getPublicRuntimeConfig } from '@/lib/config';
import { getAuthHeader } from '@/lib/auth-storage';
import type {
  ArchitectSection,
  CTAInfo,
  ImmigrationSection,
  InstitutionItem,
  InstitutionsSection,
  LandingPageData,
  MultilingualText,
} from '@/types/landingPage';

const API_TIMEOUT_MS = 5000;

type LandingPageApiData = Partial<LandingPageData> & {
  _id?: string;
};

const LANGUAGE_KEYS = ['pt', 'en', 'de'] as const;

function getLandingPageRecord(payload: unknown): LandingPageApiData | null {
  const data = Array.isArray(payload) ? payload[0] : payload;
  return data && typeof data === 'object' ? data as LandingPageApiData : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeMultilingualText(value: unknown): MultilingualText {
  if (typeof value === 'string') {
    return { pt: value };
  }

  if (!isRecord(value)) {
    return { pt: '' };
  }

  const normalized = LANGUAGE_KEYS.reduce<Partial<Record<(typeof LANGUAGE_KEYS)[number], string>>>(
    (text, key) => {
      const languageValue = value[key];
      if (typeof languageValue === 'string') {
        text[key] = languageValue;
      }
      return text;
    },
    {},
  );

  return {
    ...normalized,
    pt: normalized.pt ?? normalized.en ?? normalized.de ?? '',
  };
}

function normalizeOptionalMultilingualText(value: unknown): MultilingualText | undefined {
  return value == null ? undefined : normalizeMultilingualText(value);
}

function normalizeCta(value: unknown): CTAInfo {
  const cta = isRecord(value) ? value : {};

  return {
    label: normalizeMultilingualText(cta.label),
    target: getString(cta.target),
    icon: getOptionalString(cta.icon),
  };
}

function normalizeArchitectSection(value: unknown): ArchitectSection {
  const section = isRecord(value) ? value : {};

  return {
    imageURL: getString(section.imageURL),
    imageSubtitle: normalizeOptionalMultilingualText(section.imageSubtitle),
    title: normalizeMultilingualText(section.title),
    subtitle: normalizeOptionalMultilingualText(section.subtitle),
    content: normalizeMultilingualText(section.content),
    CTA: normalizeCta(section.CTA),
    order: getNumber(section.order, 1),
  };
}

function normalizeImmigrationSection(value: unknown): ImmigrationSection | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    imageURL: getOptionalString(value.imageURL),
    imgSubtitle: normalizeOptionalMultilingualText(value.imgSubtitle),
    title: normalizeMultilingualText(value.title),
    subtitle: normalizeOptionalMultilingualText(value.subtitle),
    content: normalizeMultilingualText(value.content),
    order: getNumber(value.order, 2),
  };
}

function normalizeInstitution(value: unknown, index: number): InstitutionItem {
  const institution = isRecord(value) ? value : {};

  return {
    id: getString(institution.id ?? institution._id),
    title: normalizeMultilingualText(institution.title),
    description: normalizeMultilingualText(institution.description),
    CTA: normalizeCta(institution.CTA),
    imageURL: getOptionalString(institution.imageURL),
    order: getNumber(institution.order, index + 1),
  };
}

function normalizeInstitutionsSection(value: unknown): InstitutionsSection {
  const section = isRecord(value) ? value : {};
  const institutions = Array.isArray(section.institutions) ? section.institutions : [];

  return {
    title: normalizeMultilingualText(section.title),
    institutions: institutions.map(normalizeInstitution),
  };
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
    mainTitle: normalizeMultilingualText(data.mainTitle),
    subtitle: normalizeMultilingualText(data.subtitle),
    architectSection: normalizeArchitectSection(data.architectSection),
    immigrationSection: normalizeImmigrationSection(data.immigrationSection),
    institutionsSection: normalizeInstitutionsSection(data.institutionsSection),
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
  const url = `${baseUrl}/landing-page?lang=all`;

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
