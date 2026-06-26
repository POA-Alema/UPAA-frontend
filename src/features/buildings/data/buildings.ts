import { getPublicRuntimeConfig } from '@/lib/config';
import type { Building, BuildingImage, BuildingTechnicalSpec, BuildingCharacteristic } from "../types/building";

const API_TIMEOUT_MS = 2_000;

type SpecLang = 'pt' | 'en' | 'de';

const SPEC_LABELS: Record<string, Record<SpecLang, string>> = {
  location:     { pt: 'Localização',     en: 'Location',       de: 'Standort' },
  date:         { pt: 'Data',            en: 'Date',           de: 'Datum' },
  project:      { pt: 'Projeto',         en: 'Design',         de: 'Entwurf' },
  construction: { pt: 'Construção',      en: 'Construction',   de: 'Bau' },
  ornaments:    { pt: 'Ornamentos',      en: 'Ornamentation',  de: 'Ornamentik' },
  builtArea:    { pt: 'Área Construída', en: 'Built Area',     de: 'Bebaute Fläche' },
  currentOcc:   { pt: 'Ocupação Atual',  en: 'Current Use',    de: 'Aktuelle Nutzung' },
  restoration:  { pt: 'Restauração',     en: 'Restoration',    de: 'Restaurierung' },
};

const ARCHITECT_CTA_DESCRIPTION: Record<SpecLang, (name?: string) => string> = {
  pt: (name) => name
    ? `Explore a vida e o legado de ${name}, o arquiteto que moldou a paisagem urbana de Porto Alegre com suas obras monumentais.`
    : 'Explore a vida e o legado do arquiteto vinculado a esta edificação.',
  en: (name) => name
    ? `Explore the life and legacy of ${name}, the architect who shaped Porto Alegre's urban landscape with monumental works.`
    : 'Explore the life and legacy of the architect linked to this building.',
  de: (name) => name
    ? `Erkunden Sie das Leben und Vermächtnis von ${name}, dem Architekten, der die Stadtlandschaft von Porto Alegre mit monumentalen Werken prägte.`
    : 'Erkunden Sie das Leben und Vermächtnis des mit diesem Gebäude verbundenen Architekten.',
};

const ARCHITECT_CTA_LABEL: Record<SpecLang, string> = {
  pt: 'Conheça mais sobre o Arquiteto',
  en: 'Learn more about the Architect',
  de: 'Mehr über den Architekten erfahren',
};

function specLabel(key: string, lang: string): string {
  const l = (lang === 'en' || lang === 'de' ? lang : 'pt') as SpecLang;
  return SPEC_LABELS[key]?.[l] ?? SPEC_LABELS[key]?.pt ?? key;
}

function extractLocalized(value: unknown, lang = 'pt'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, string>;
    const l = lang as SpecLang;
    const composedName = [obj.first, obj.last].filter(Boolean).join(' ');
    return obj[l] ?? obj.pt ?? obj.en ?? obj.de ?? obj.full ?? composedName ?? '';
  }
  return '';
}

// Backend serves both camelCase (older) and snake_case (current) field names.
function pick(api: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (api[key] !== undefined && api[key] !== null) return api[key];
  }
  return undefined;
}

function getArchitectInfo(api: Record<string, unknown>, lang: string) {
  const architect = typeof api['architect'] === 'object' && api['architect']
    ? api['architect'] as Record<string, unknown>
    : undefined;
  const slug = String(pick(api, 'architect_slug') ?? architect?.['slug'] ?? '').trim();
  const name = architect
    ? extractLocalized(architect['name'], lang)
    : String(api['architect'] ?? '');

  return {
    name,
    href: slug ? `/architects/${slug}` : undefined,
  };
}

function mapApiToBuilding(api: Record<string, unknown>, lang = 'pt'): Building {
  // Backend stores absolute URLs pointing at the public S3 bucket (see src/lib/s3.ts).
  const mediaGallery = Array.isArray(api['mediaGallery'])
    ? (api['mediaGallery'] as Record<string, unknown>[])
    : Array.isArray(api['media_gallery'])
      ? (api['media_gallery'] as Record<string, unknown>[])
      : [];

  const gallery: BuildingImage[] = mediaGallery.map((item) => {
    const itemCaption = extractLocalized(item['caption'], lang);
    const buildingName = extractLocalized(api['name'], lang);
    return {
      src: String(item['url'] ?? ''),
      alt: itemCaption || buildingName || 'Imagem da edificação',
      caption: itemCaption || undefined,
      title:
        extractLocalized(item['title'], lang) || undefined,
      description: extractLocalized(item['description'], lang) || undefined,
    };
  });

  const hero: BuildingImage | undefined = gallery[0];

  const features = Array.isArray(api['features'])
    ? (api['features'] as Record<string, unknown>[])
    : [];

  const characteristics: BuildingCharacteristic[] = features.map((f) => ({
    icon: String(f['icon_url'] ?? f['icon'] ?? ''),
    title: extractLocalized(f['title'], lang),
    description: extractLocalized(f['description'], lang),
  }));

  const constructionPeriod = extractLocalized(pick(api, 'constructionPeriod', 'construction_period'), lang);

  const technicalSpecs: BuildingTechnicalSpec[] = [];
  if (pick(api, 'location')) technicalSpecs.push({ label: specLabel('location', lang), value: extractLocalized(pick(api, 'location'), lang) });
  if (constructionPeriod) technicalSpecs.push({ label: specLabel('date', lang), value: constructionPeriod });
  if (pick(api, 'constructor')) technicalSpecs.push({ label: specLabel('construction', lang), value: extractLocalized(pick(api, 'constructor'), lang) });
  if (pick(api, 'ornamentsAuthor', 'ornaments_author')) technicalSpecs.push({ label: specLabel('ornaments', lang), value: extractLocalized(pick(api, 'ornamentsAuthor', 'ornaments_author'), lang) });
  if (pick(api, 'builtArea', 'built_area')) technicalSpecs.push({ label: specLabel('builtArea', lang), value: extractLocalized(pick(api, 'builtArea', 'built_area'), lang) });
  if (pick(api, 'currentOccupation', 'current_occupation')) technicalSpecs.push({ label: specLabel('currentOcc', lang), value: extractLocalized(pick(api, 'currentOccupation', 'current_occupation'), lang) });
  if (pick(api, 'restorationAndHeritage', 'restoration_and_heritage')) technicalSpecs.push({ label: specLabel('restoration', lang), value: extractLocalized(pick(api, 'restorationAndHeritage', 'restoration_and_heritage'), lang) });

  const architect = getArchitectInfo(api, lang);
  const architectName = architect.name;

  const eyebrowParts = [architectName, constructionPeriod].filter(Boolean);
  const l = (lang === 'en' || lang === 'de' ? lang : 'pt') as SpecLang;

  return {
    id: String(api['id'] ?? api['_id'] ?? ''),
    slug: String(api['slug'] ?? ''),
    eyebrow: eyebrowParts.join(', ') || undefined,
    title: extractLocalized(pick(api, 'name', 'title'), lang) || '',
    subtitle: extractLocalized(pick(api, 'originalName', 'original_name'), lang) || undefined,
    summary: extractLocalized(pick(api, 'description'), lang) || '',
    hero,
    history: extractLocalized(pick(api, 'history'), lang) || '',
    technicalSpecs: technicalSpecs.length > 0 ? technicalSpecs : undefined,
    characteristics: characteristics.length > 0 ? characteristics : undefined,
    gallery: gallery.length > 0 ? gallery : undefined,
    architectCta: {
      description: ARCHITECT_CTA_DESCRIPTION[l](architectName || undefined),
      label: ARCHITECT_CTA_LABEL[l],
      href: architect.href,
    },
  };
}

async function fetchBuildings(lang = 'pt'): Promise<Building[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/buildings?lang=${lang}`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar edificacoes.`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Resposta invalida ao carregar edificacoes.');
  }

  return data.map((item) => mapApiToBuilding(item, lang));
}

export async function listBuildings(lang = 'pt'): Promise<Building[]> {
  return fetchBuildings(lang);
}

export async function getBuildingBySlug(slug: string, lang = 'pt'): Promise<Building | null> {
  // The listing endpoint returns a trimmed shape; fetch the detail endpoint for the
  // full resolved building (description, history, features, …).
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');

  const response = await fetch(`${baseUrl}/buildings/${slug}?lang=${lang}`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: nao foi possivel carregar a edificacao.`);
  }

  const data = await response.json() as Record<string, unknown>;
  return mapApiToBuilding(data, lang);
}

export async function getFeaturedBuilding(lang = 'pt'): Promise<Building | null> {
  const buildings = await listBuildings(lang);
  return buildings[0] ?? null;
}
