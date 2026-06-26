import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loginAdmin, registerAdmin } from '@/services/auth';
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

describe('auth service', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('envia credenciais para login', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => authResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await loginAdmin({
      email: 'admin@poaalema.com',
      password: 'admin123',
    });

    expect(result).toEqual(authResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@poaalema.com',
          password: 'admin123',
        }),
      }),
    );
  });

  it('envia dados para cadastro', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => authResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    await registerAdmin({
      name: 'Admin Teste',
      email: 'admin@poaalema.com',
      password: 'admin123',
      role: 'CONTENT_MANAGER',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Admin Teste',
          email: 'admin@poaalema.com',
          password: 'admin123',
          role: 'CONTENT_MANAGER',
        }),
      }),
    );
  });

  it('propaga mensagem de erro do backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'E-mail ou senha inválidos.' }),
      }),
    );

    await expect(
      loginAdmin({
        email: 'admin@poaalema.com',
        password: 'errada',
      }),
    ).rejects.toThrow('E-mail ou senha inválidos.');
  });
});
