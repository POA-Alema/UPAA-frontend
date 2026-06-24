import type { AdminRole, AuthResponse, StoredAuthSession } from '@/types/auth';

export const AUTH_STORAGE_KEY = 'upaa_admin_auth';

export function normalizeAdminRole(role: string): AdminRole {
  return role.trim().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CONTENT_MANAGER';
}

function isStoredAuthSession(value: unknown): value is StoredAuthSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<StoredAuthSession>;

  return Boolean(
      session.access_token &&
      session.token_type === 'Bearer' &&
      session.user?.id &&
      session.user.email &&
      session.user.role &&
      typeof session.password === 'string',
  );
}

export function saveAuthSession(auth: AuthResponse, password: string): StoredAuthSession | null {
  if (typeof window === 'undefined') return null;

  const session: StoredAuthSession = {
    ...auth,
    password,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function getAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') return null;

  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    const parsed = JSON.parse(rawSession) as unknown;
    if (!isStoredAuthSession(parsed)) return null;

    return {
      ...parsed,
      user: {
        ...parsed.user,
        role: normalizeAdminRole(parsed.user.role),
      },
    };
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function hasAuthSession(): boolean {
  return getAuthSession() !== null;
}

export function getAuthHeader(): Record<string, string> {
  const token = getAuthSession()?.access_token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}
