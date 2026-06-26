import { getPublicRuntimeConfig } from '@/lib/config';
import { getAuthHeader } from '@/lib/auth-storage';
import type {
  AdminArchitect,
  ArchitectFormData,
  ArchitectStatus,
} from '@/types/adminArchitect';

export interface ArchitectOption {
  id: string;
  slug: string;
  name: string;
}

const API_TIMEOUT_MS = 5_000;

export async function getArchitects(): Promise<ArchitectOption[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const url = `${apiUrl.replace(/\/$/, '')}/architects`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(3_000),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseArchitectError(response));
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Resposta inválida ao carregar arquitetos.');
  }

  return data.map((a: Record<string, unknown>) => ({
    id: typeof a['id'] === 'string' ? a['id'] : typeof a['_id'] === 'string' ? a['_id'] : '',
    slug: typeof a['slug'] === 'string' ? a['slug'] : '',
    name: typeof a['name'] === 'string'
      ? a['name']
      : a['name'] && typeof a['name'] === 'object'
        ? ((a['name'] as Record<string, string>)['pt'] ?? (a['name'] as Record<string, string>)['en'] ?? '')
        : String(a['name'] ?? ''),
  }));
}

async function parseArchitectError(response: Response): Promise<string> {
  const defaultMessage = `Erro ${response.status}: não foi possível concluir a operação.`;

  try {
    const json = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join('; ');
    return json.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

async function requestAdminArchitectsApi<T>(
  path = '',
  init?: RequestInit & { expectJson?: boolean },
): Promise<T | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/architects${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseArchitectError(response));
  }

  if (init?.expectJson === false || response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function optionalNullableNumber(value: unknown): number | null | undefined {
  if (value === null) return null;
  return optionalNumber(value);
}

function normalizeStatus(value: unknown): ArchitectStatus {
  return value === 'draft' || value === 'archived' || value === 'published'
    ? value
    : 'published';
}

function normalizeAdminArchitect(value: Record<string, unknown>): AdminArchitect {
  const firstName = trimString(value.firstName);
  const lastName = trimString(value.lastName);
  const fullName =
    trimString(value.fullName) || [firstName, lastName].filter(Boolean).join(' ');

  return {
    id: trimString(value.id),
    slug: trimString(value.slug),
    status: normalizeStatus(value.status),
    firstName,
    lastName,
    fullName,
    portraitUrl: trimString(value.portraitUrl),
    portraitAlt: trimString(value.portraitAlt),
    birthDay: optionalNumber(value.birthDay),
    birthMonth: optionalNumber(value.birthMonth),
    birthYear: optionalNumber(value.birthYear),
    birthCity: trimString(value.birthCity),
    birthCountry: trimString(value.birthCountry),
    deathDay: optionalNullableNumber(value.deathDay),
    deathMonth: optionalNullableNumber(value.deathMonth),
    deathYear: optionalNullableNumber(value.deathYear),
    deathCity: trimString(value.deathCity) || null,
    deathCountry: trimString(value.deathCountry) || null,
    citizenship: trimString(value.citizenship),
    occupation: trimString(value.occupation),
    about: trimString(value.about),
    style: trimString(value.style),
    influences: trimString(value.influences),
    legacy: trimString(value.legacy),
    buildingsCount: optionalNumber(value.buildingsCount),
    createdAt: trimString(value.createdAt) || undefined,
    updatedAt: trimString(value.updatedAt) || undefined,
  };
}

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanFormData(data: ArchitectFormData): Record<string, unknown> {
  const fullName = data.fullName?.trim() || [data.firstName, data.lastName].filter(Boolean).join(' ');
  const slug = generateSlug([data.firstName, data.lastName].filter(Boolean).join(' '));
  const dto: Record<string, unknown> = {
    slug,
    status: data.status,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    fullName,
    portraitUrl: data.portraitUrl.trim(),
    portraitAlt: data.portraitAlt.trim(),
    birthDay: data.birthDay,
    birthMonth: data.birthMonth,
    birthYear: data.birthYear,
    birthCity: data.birthCity.trim(),
    birthCountry: data.birthCountry.trim(),
    citizenship: data.citizenship.trim(),
    occupation: data.occupation.trim(),
    about: data.about,
    style: data.style.trim(),
    influences: data.influences.trim(),
    legacy: data.legacy.trim(),
  };

  if (data.deathYear) {
    dto.deathDay = data.deathDay;
    dto.deathMonth = data.deathMonth;
    dto.deathYear = data.deathYear;
    dto.deathCity = data.deathCity?.trim() || '';
    dto.deathCountry = data.deathCountry?.trim() || '';
  } else {
    dto.deathYear = null;
  }

  return dto;
}

export async function getAdminArchitects(): Promise<AdminArchitect[]> {
  const response = await requestAdminArchitectsApi<Record<string, unknown>[]>('/admin');
  return (response ?? []).map(normalizeAdminArchitect);
}

export async function getAdminArchitect(id: string): Promise<AdminArchitect> {
  const response = await requestAdminArchitectsApi<Record<string, unknown>>(`/admin/${id}`);
  if (!response) throw new Error('Arquiteto não encontrado.');
  return normalizeAdminArchitect(response);
}

export async function createAdminArchitect(data: ArchitectFormData): Promise<AdminArchitect> {
  const response = await requestAdminArchitectsApi<Record<string, unknown>>('', {
    method: 'POST',
    body: JSON.stringify(cleanFormData(data)),
  });

  if (!response) throw new Error('Nenhuma resposta do servidor ao criar arquiteto.');

  return normalizeAdminArchitect(response);
}

export async function updateAdminArchitect(
  id: string,
  data: ArchitectFormData,
): Promise<AdminArchitect> {
  const response = await requestAdminArchitectsApi<Record<string, unknown>>(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cleanFormData(data)),
  });

  if (!response) throw new Error('Nenhuma resposta do servidor ao atualizar arquiteto.');

  return normalizeAdminArchitect(response);
}

export async function deleteAdminArchitect(id: string): Promise<void> {
  await requestAdminArchitectsApi(`/${id}`, {
    method: 'DELETE',
    expectJson: false,
  });
}

export async function uploadArchitectPortrait(file: File): Promise<string> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}/architects/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseArchitectError(response));
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    throw new Error('O servidor não retornou a URL do retrato enviado.');
  }

  return payload.url;
}
