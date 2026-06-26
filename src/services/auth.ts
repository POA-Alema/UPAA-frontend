import { getPublicRuntimeConfig } from '@/lib/config';
import { getAuthHeader } from '@/lib/auth-storage';
import type { AuthResponse, AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth';

const API_TIMEOUT_MS = 5_000;

async function parseAuthError(response: Response): Promise<string> {
  const fallback = `Erro ${response.status}: não foi possível autenticar.`;

  try {
    const json = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join('; ');
    return json.message || fallback;
  } catch {
    return fallback;
  }
}

async function requestAuth<T>(
  path: 'login' | 'register',
  body: LoginCredentials | RegisterCredentials,
  requireAuth = false,
): Promise<T> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(requireAuth ? getAuthHeader() : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseAuthError(response));
  }

  return (await response.json()) as T;
}

export function loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
  return requestAuth<AuthResponse>('login', credentials);
}

export function registerAdmin(credentials: RegisterCredentials): Promise<AuthUser> {
  return requestAuth<AuthUser>('register', credentials, true);
}
