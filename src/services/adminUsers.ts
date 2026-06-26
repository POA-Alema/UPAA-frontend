import { getAuthHeader } from '@/lib/auth-storage';
import { getPublicRuntimeConfig } from '@/lib/config';
import type { AdminUser, AdminUserFormData } from '@/types/adminUser';

const API_TIMEOUT_MS = 5_000;

async function parseAdminUserError(response: Response): Promise<string> {
  const defaultMessage = `Erro ${response.status}: não foi possível concluir a operação.`;

  try {
    const json = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join('; ');
    return json.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

async function requestAdminUsersApi<T>(
  path = '',
  init?: RequestInit & { expectJson?: boolean },
): Promise<T | null> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/admin/users${path}`, {
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
    throw new Error(await parseAdminUserError(response));
  }

  if (init?.expectJson === false || response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return (await requestAdminUsersApi<AdminUser[]>()) ?? [];
}

export async function getAdminUser(id: string): Promise<AdminUser> {
  const user = await requestAdminUsersApi<AdminUser>(`/${id}`);

  if (!user) throw new Error('Usuário não encontrado.');

  return user;
}

export function createAdminUser(data: AdminUserFormData): Promise<AdminUser | null> {
  return requestAdminUsersApi<AdminUser>('', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminUser(id: string, data: AdminUserFormData): Promise<AdminUser | null> {
  const payload: Partial<AdminUserFormData> = { ...data };
  if (!payload.password) delete payload.password;

  return requestAdminUsersApi<AdminUser>(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteAdminUser(id: string): Promise<null> {
  return requestAdminUsersApi<never>(`/${id}`, {
    method: 'DELETE',
    expectJson: false,
  }) as Promise<null>;
}
