import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLandingPageData, updateLandingPageData, INITIAL_LANDING_PAGE_DATA } from '../landingPage';
import type { LandingPageData } from '@/types/landingPage';

describe('landingPage service', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
    localStorage.clear();
    vi.spyOn(localStorage, 'getItem');
    vi.spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('should fetch and normalize landing page data from API', async () => {
    const mockApiResponse = {
      id: 'mock-lp-id',
      mainTitle: { pt: 'Título Principal PT', en: 'Main Title EN', de: 'Haupttitel DE' },
      subtitle: { pt: 'Subtítulo PT', en: 'Subtitle EN', de: 'Untertitel DE' },
      architectSection: {
        imageURL: '/images/test.jpg',
        title: { pt: 'O Arquiteto PT' },
        content: { pt: '<p>Descrição PT</p>' },
        CTA: { label: { pt: 'Botão' }, target: '/test', icon: 'test-icon' },
        order: 1,
      },
      immigrationSection: {
        imageURL: '/images/test-imm.jpg',
        title: { pt: 'Imigração PT' },
        content: { pt: '<p>Imigração descrição PT</p>' },
        order: 2,
      },
      institutionsSection: {
        title: { pt: 'Instituições PT' },
        institutions: [],
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      })
    );

    const result = await getLandingPageData();

    expect(result.id).toBe('mock-lp-id');
    expect(result.mainTitle.pt).toBe('Título Principal PT');
    expect(result.subtitle.en).toBe('Subtitle EN');
    expect(result.architectSection.imageURL).toBe('/images/test.jpg');
    expect(result.immigrationSection?.title?.pt).toBe('Imigração PT');
    expect(result.institutionsSection.institutions).toEqual([]);
  });

  it('should fallback to local storage when fetch fails', async () => {
    const mockLocalStorageData: LandingPageData = {
      ...INITIAL_LANDING_PAGE_DATA,
      mainTitle: { pt: 'Título Local Storage', en: 'Title Local Storage EN' },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    // Write directly to the real localStorage
    localStorage.setItem('upaa_landing_page', JSON.stringify(mockLocalStorageData));

    const result = await getLandingPageData();

    expect(result.mainTitle.pt).toBe('Título Local Storage');
    expect(localStorage.getItem).toHaveBeenCalledWith('upaa_landing_page');
  });

  it('should update landing page data locally and call PUT endpoint when ID is present', async () => {
    const updateData: LandingPageData = {
      ...INITIAL_LANDING_PAGE_DATA,
      id: 'existing-id',
      mainTitle: { pt: 'Novo Título' },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => updateData,
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await updateLandingPageData(updateData);

    expect(result.mainTitle.pt).toBe('Novo Título');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'upaa_landing_page',
      JSON.stringify(updateData)
    );
    expect(JSON.parse(localStorage.getItem('upaa_landing_page') || '{}')).toEqual(updateData);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/landing-page/existing-id',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
    );
  });

  it('should throw and preserve local data when API returns error response', async () => {
    const updateData: LandingPageData = {
      ...INITIAL_LANDING_PAGE_DATA,
      id: 'existing-id',
      mainTitle: { pt: 'Título que falhou no servidor' },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );

    await expect(updateLandingPageData(updateData)).rejects.toThrow(
      'Erro ao salvar no servidor. As alterações foram preservadas localmente.'
    );

    expect(JSON.parse(localStorage.getItem('upaa_landing_page') || '{}')).toEqual(updateData);
  });

  it('should throw and preserve local data when API is unreachable', async () => {
    const updateData: LandingPageData = {
      ...INITIAL_LANDING_PAGE_DATA,
      id: 'existing-id',
      mainTitle: { pt: 'Título offline' },
    };

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(updateLandingPageData(updateData)).rejects.toThrow(
      'Servidor indisponível. As alterações foram preservadas localmente.'
    );

    expect(JSON.parse(localStorage.getItem('upaa_landing_page') || '{}')).toEqual(updateData);
  });
});
