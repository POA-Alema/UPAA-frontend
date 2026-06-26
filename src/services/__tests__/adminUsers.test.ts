import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthSession } from '@/lib/auth-storage';
import { createAdminUser, getAdminUsers, updateAdminUser } from '@/services/adminUsers';
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

describe('adminUsers service', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    localStorage.clear();
    saveAuthSession(authResponse, 'admin123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('lista usuários com token bearer', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [authResponse.user],
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getAdminUsers();

    expect(result).toEqual([authResponse.user]);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/admin/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      }),
    );
  });

  it('cria usuário administrativo', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => authResponse.user,
    });
    vi.stubGlobal('fetch', fetchMock);

    await createAdminUser({
      name: 'Conteúdo',
      email: 'conteudo@poaalema.com',
      password: 'admin123',
      role: 'CONTENT_MANAGER',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/admin/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Conteúdo',
          email: 'conteudo@poaalema.com',
          password: 'admin123',
          role: 'CONTENT_MANAGER',
        }),
      }),
    );
  });

  it('omite senha vazia ao atualizar usuário', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => authResponse.user,
    });
    vi.stubGlobal('fetch', fetchMock);

    await updateAdminUser('admin-id', {
      name: 'Admin',
      email: 'admin@poaalema.com',
      password: '',
      role: 'ADMIN',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/admin/users/admin-id',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Admin',
          email: 'admin@poaalema.com',
          role: 'ADMIN',
        }),
      }),
    );
  });
});
