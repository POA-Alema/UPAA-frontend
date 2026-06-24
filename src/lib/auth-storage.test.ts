import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_STORAGE_KEY,
  clearAuthSession,
  getAuthSession,
  hasAuthSession,
  saveAuthSession,
} from '@/lib/auth-storage';
import type { AuthResponse } from '@/types/auth';

const authResponse: AuthResponse = {
  access_token: 'token',
  token_type: 'Bearer',
  expires_in: '7d',
  user: {
    id: 'admin-id',
    name: 'Admin Teste',
    email: 'admin@poaalema.com',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('auth-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('salva e recupera a sessão com a senha autorizada', () => {
    saveAuthSession(authResponse, 'admin123');

    const session = getAuthSession();

    expect(session).toEqual({
      ...authResponse,
      password: 'admin123',
      savedAt: '2026-01-01T12:00:00.000Z',
    });
    expect(hasAuthSession()).toBe(true);
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toContain('"password":"admin123"');
  });

  it('remove a sessão', () => {
    saveAuthSession(authResponse, 'admin123');

    clearAuthSession();

    expect(getAuthSession()).toBeNull();
    expect(hasAuthSession()).toBe(false);
  });

  it('ignora payload inválido', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: 'token' }));

    expect(getAuthSession()).toBeNull();
  });
});
