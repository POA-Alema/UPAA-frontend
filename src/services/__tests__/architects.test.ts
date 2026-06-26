import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { saveAuthSession } from '@/lib/auth-storage';
import {
  createAdminArchitect,
  deleteAdminArchitect,
  getArchitects,
  getAdminArchitects,
  updateAdminArchitect,
} from '@/services/architects';
import type { AuthResponse } from '@/types/auth';
import type { ArchitectFormData } from '@/types/adminArchitect';

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

const architectPayload = {
  id: 'architect-id',
  slug: 'theodor-wiederspahn',
  status: 'published',
  firstName: 'Theodor',
  lastName: 'Wiederspahn',
  fullName: 'Theodor Wiederspahn',
  portraitUrl: 'https://bucket/uploads/theodor.png',
  portraitAlt: 'Retrato de Theodor Wiederspahn',
  birthDay: 19,
  birthMonth: 2,
  birthYear: 1878,
  birthCity: 'Wiesbaden',
  birthCountry: 'Alemanha',
  citizenship: 'alemã',
  occupation: 'Arquiteto',
  about: '<p>Biografia</p>',
  style: 'Ecletismo',
  influences: 'Formação europeia',
  legacy: 'Legado em Porto Alegre',
  buildingsCount: 2,
};

const formData: ArchitectFormData = {
  status: 'published',
  firstName: 'Theodor',
  lastName: 'Wiederspahn',
  fullName: 'Theodor Wiederspahn',
  portraitUrl: 'https://bucket/uploads/theodor.png',
  portraitAlt: 'Retrato de Theodor Wiederspahn',
  birthDay: 19,
  birthMonth: 2,
  birthYear: 1878,
  birthCity: 'Wiesbaden',
  birthCountry: 'Alemanha',
  deathDay: null,
  deathMonth: null,
  deathYear: null,
  deathCity: null,
  deathCountry: null,
  citizenship: 'alemã',
  occupation: 'Arquiteto',
  about: '<p>Biografia</p>',
  style: 'Ecletismo',
  influences: 'Formação europeia',
  legacy: 'Legado em Porto Alegre',
};

describe('architects admin service', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    localStorage.clear();
    saveAuthSession(authResponse, 'admin123');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('lista arquitetos administrativos com token bearer', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [architectPayload],
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getAdminArchitects();

    expect(result).toEqual([expect.objectContaining({ id: 'architect-id', fullName: 'Theodor Wiederspahn' })]);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/architects/admin',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      }),
    );
  });

  it('lista arquitetos públicos sem fallback silencioso', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'architect-id', slug: 'theodor', name: 'Theodor Wiederspahn' }],
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getArchitects()).resolves.toEqual([
      { id: 'architect-id', slug: 'theodor', name: 'Theodor Wiederspahn' },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/architects',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('propaga erro ao carregar arquitetos públicos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Erro ao carregar arquitetos.' }),
      }),
    );

    await expect(getArchitects()).rejects.toThrow('Erro ao carregar arquitetos.');
  });

  it('cria arquiteto gerando slug quando o campo vem vazio', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => architectPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await createAdminArchitect(formData);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string) as Record<string, unknown>;

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/architects',
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(body).toMatchObject({
      slug: 'theodor-wiederspahn',
      firstName: 'Theodor',
      lastName: 'Wiederspahn',
      deathYear: null,
    });
  });

  it('atualiza arquiteto no endpoint protegido', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => architectPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await updateAdminArchitect('architect-id', {
      ...formData,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/architects/architect-id',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('"slug":"theodor-wiederspahn"'),
      }),
    );
  });

  it('remove arquiteto no endpoint protegido', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => architectPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    await deleteAdminArchitect('architect-id');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/architects/architect-id',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});
