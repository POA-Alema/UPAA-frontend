import { getPublicRuntimeConfig } from '@/lib/config';

export interface ArchitectOption {
  id: string;
  slug: string;
  name: string;
}

export async function getArchitects(): Promise<ArchitectOption[]> {
  try {
    const { apiUrl } = getPublicRuntimeConfig();
    const url = `${apiUrl.replace(/\/$/, '')}/architects`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3_000),
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((a: Record<string, unknown>) => ({
      id: typeof a['id'] === 'string' ? a['id'] : typeof a['_id'] === 'string' ? a['_id'] : '',
      slug: typeof a['slug'] === 'string' ? a['slug'] : '',
      name: typeof a['name'] === 'string'
        ? a['name']
        : a['name'] && typeof a['name'] === 'object'
          ? ((a['name'] as Record<string, string>)['pt'] ?? (a['name'] as Record<string, string>)['en'] ?? '')
          : String(a['name'] ?? ''),
    }));
  } catch {
    return [];
  }
}
