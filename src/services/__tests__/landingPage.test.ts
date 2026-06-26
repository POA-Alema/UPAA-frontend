import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLandingPageData, updateLandingPageData } from '../landingPage';
import type { LandingPageData } from '@/types/landingPage';

const landingPageData: LandingPageData = {
  id: 'landing-page-id',
  mainTitle: { pt: 'Titulo Principal PT', en: 'Main Title EN', de: 'Haupttitel DE' },
  subtitle: { pt: 'Subtitulo PT', en: 'Subtitle EN', de: 'Untertitel DE' },
  architectSection: {
    imageURL: '/images/test.jpg',
    title: { pt: 'O Arquiteto PT' },
    content: { pt: '<p>Descricao PT</p>' },
    CTA: { label: { pt: 'Botao' }, target: '/test', icon: 'test-icon' },
    order: 1,
  },
  immigrationSection: {
    imageURL: '/images/test-imm.jpg',
    title: { pt: 'Imigracao PT' },
    content: { pt: '<p>Imigracao descricao PT</p>' },
    order: 2,
  },
  institutionsSection: {
    title: { pt: 'Instituicoes PT' },
    institutions: [],
  },
};

describe('landingPage service', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('should fetch and normalize landing page data from API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => landingPageData,
      })
    );

    const result = await getLandingPageData();

    expect(result.id).toBe('landing-page-id');
    expect(result.mainTitle.pt).toBe('Titulo Principal PT');
    expect(result.subtitle.en).toBe('Subtitle EN');
    expect(result.architectSection.imageURL).toBe('/images/test.jpg');
    expect(result.immigrationSection?.title?.pt).toBe('Imigracao PT');
    expect(result.institutionsSection.institutions).toEqual([]);
  });

  it('should throw when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    await expect(getLandingPageData()).rejects.toThrow('Network error');
  });

  it('should call PUT endpoint when ID is present', async () => {
    const updateData: LandingPageData = {
      ...landingPageData,
      mainTitle: { pt: 'Novo Titulo' },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => updateData,
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await updateLandingPageData(updateData);

    expect(result.mainTitle.pt).toBe('Novo Titulo');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/landing-page/landing-page-id',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
    );
  });

  it('should throw when API returns error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ message: 'Erro no servidor' }),
      })
    );

    await expect(updateLandingPageData(landingPageData)).rejects.toThrow(
      'Erro no servidor'
    );
  });

  it('should throw when API is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(updateLandingPageData(landingPageData)).rejects.toThrow(
      'Network error'
    );
  });
});
