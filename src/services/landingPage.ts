import { getPublicRuntimeConfig } from '@/lib/config';
import { getAuthHeader } from '@/lib/auth-storage';
import { s3ImageUrl } from '@/lib/s3';
import type { LandingPageData } from '@/types/landingPage';

const LOCAL_STORAGE_KEY = 'upaa_landing_page';
const API_TIMEOUT_MS = 5000;

export const INITIAL_LANDING_PAGE_DATA: LandingPageData = {
  mainTitle: {
    pt: 'Uma Porto Alegre alemã',
    en: 'A German Porto Alegre',
    de: 'Ein deutsches Porto Alegre',
  },
  subtitle: {
    pt: 'Arquitetura, memória e cidade a partir do legado de Theodor Wiederspahn.',
    en: 'Architecture, memory and city through the legacy of Theodor Wiederspahn.',
    de: 'Architektur, Erinnerung und Stadt aus dem Vermächtnis von Theodor Wiederspahn.',
  },
  architectSection: {
    imageURL: s3ImageUrl('images/theodor.png'),
    imageSubtitle: {
      pt: 'Theodor Wiederspahn',
      en: 'Theodor Wiederspahn',
      de: 'Theodor Wiederspahn',
    },
    title: {
      pt: 'O arquiteto',
      en: 'The architect',
      de: 'Der Architekt',
    },
    subtitle: {
      pt: 'Um nome central na paisagem de Porto Alegre',
      en: "A central name in Porto Alegre's landscape",
      de: 'Ein zentraler Name in der Stadtlandschaft von Porto Alegre',
    },
    content: {
      pt: '<p>A trajetória de Theodor Wiederspahn ajuda a entender parte importante da formação visual e simbólica do Centro Histórico de Porto Alegre.</p>',
      en: '<p>The trajectory of Theodor Wiederspahn helps explain an important part of the visual and symbolic formation of Porto Alegre\'s historic center.</p>',
      de: '<p>Die Laufbahn von Theodor Wiederspahn hilft, einen wichtigen Teil der visuellen und symbolischen Prägung des historischen Zentrums von Porto Alegre zu verstehen.</p>',
    },
    CTA: {
      label: {
        pt: 'Conhecer arquiteto',
        en: 'Meet the architect',
        de: 'Architekten kennenlernen',
      },
      target: '/architects/theodor-wiederspahn',
      icon: 'user',
    },
    order: 1,
  },
  immigrationSection: {
    imageURL: s3ImageUrl('images/home/imigracao-alema-rs.jpg'),
    imgSubtitle: {
      pt: 'Registros da imigração alemã no Rio Grande do Sul',
      en: 'Records of German immigration in Rio Grande do Sul',
      de: 'Aufzeichnungen der deutschen Einwanderung in Rio Grande do Sul',
    },
    title: {
      pt: 'Imigração alemã',
      en: 'German immigration',
      de: 'Deutsche Einwanderung',
    },
    subtitle: {
      pt: 'Das colônias ao Centro Histórico',
      en: 'From colonies to the Historic Center',
      de: 'Von den Kolonien ins historische Zentrum',
    },
    content: {
      pt: '<p>A partir de 1824, imigrantes alemães chegaram ao Rio Grande do Sul e estabeleceram colônias que influenciaram profundamente a cultura, a economia e a arquitetura da região. Em Porto Alegre, essa presença se materializou em edificações do Centro Histórico que até hoje marcam a paisagem urbana da cidade.</p>',
      en: '<p>From 1824 onwards, German immigrants arrived in Rio Grande do Sul and established colonies that deeply influenced the culture, economy and architecture of the region. In Porto Alegre, this presence materialized in buildings in the Historic Center that still mark the city\'s urban landscape today.</p>',
      de: '<p>Ab 1824 kamen deutsche Einwanderer nach Rio Grande do Sul und gründeten Kolonien, die Kultur, Wirtschaft und Architektur der Region nachhaltig prägten. In Porto Alegre materialisierte sich diese Präsenz in Gebäuden des historischen Zentrums, die das Stadtbild bis heute prägen.</p>',
    },
    order: 2,
  },
  institutionsSection: {
    title: {
      pt: 'Instituições em destaque',
      en: 'Featured institutions',
      de: 'Hervorgehobene Institutionen',
    },
    institutions: [
      {
        id: 'inst-margs',
        title: {
          pt: 'MARGS',
          en: 'MARGS',
          de: 'MARGS',
        },
        description: {
          pt: '<p>Museu instalado em edifício histórico associado a Theodor Wiederspahn.</p>',
          en: '<p>Museum housed in a historic building associated with Theodor Wiederspahn.</p>',
          de: '<p>Museum in einem historischen Gebäude, das mit Theodor Wiederspahn verbunden ist.</p>',
        },
        CTA: {
          label: {
            pt: 'Ver edifício',
            en: 'View building',
            de: 'Gebäude ansehen',
          },
          target: '/buildings/margs-museu-de-arte-do-rio-grande-do-sul',
          icon: 'building',
        },
        imageURL: s3ImageUrl('images/Margs_2.jpg'),
        order: 1,
      },
      {
        id: 'inst-memorial',
        title: {
          pt: 'Memorial do RS',
          en: 'Memorial do RS',
          de: 'Memorial do RS',
        },
        description: {
          pt: '<p>Espaço cultural em prédio histórico da Praça da Alfândega.</p>',
          en: '<p>Cultural space in a historic Praça da Alfândega building.</p>',
          de: '<p>Kulturraum in einem historischen Gebäude an der Praça da Alfândega.</p>',
        },
        CTA: {
          label: {
            pt: 'Ver edifício',
            en: 'View building',
            de: 'Gebäude ansehen',
          },
          target: '/buildings/memorial-do-rio-grande-do-sul',
          icon: 'landmark',
        },
        imageURL: s3ImageUrl('images/Memorial RS.jpg'),
        order: 2,
      },
    ],
  },
};

function getLocalData(): LandingPageData {
  if (typeof window === 'undefined') {
    return INITIAL_LANDING_PAGE_DATA;
  }
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!local) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LANDING_PAGE_DATA));
    return INITIAL_LANDING_PAGE_DATA;
  }
  try {
    return JSON.parse(local) as LandingPageData;
  } catch {
    return INITIAL_LANDING_PAGE_DATA;
  }
}

function saveLocalData(data: LandingPageData): LandingPageData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

export async function getLandingPageData(): Promise<LandingPageData> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  const url = `${baseUrl}/landing-page`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return getLocalData();
    }

    const payload = await response.json();
    const data = Array.isArray(payload) ? payload[0] : payload;
    if (!data) {
      return getLocalData();
    }

    return {
      id: data.id || data._id,
      mainTitle: data.mainTitle || INITIAL_LANDING_PAGE_DATA.mainTitle,
      subtitle: data.subtitle || INITIAL_LANDING_PAGE_DATA.subtitle,
      architectSection: {
        ...INITIAL_LANDING_PAGE_DATA.architectSection,
        ...data.architectSection,
      },
      immigrationSection: data.immigrationSection ? {
        ...INITIAL_LANDING_PAGE_DATA.immigrationSection,
        ...data.immigrationSection,
      } : INITIAL_LANDING_PAGE_DATA.immigrationSection,
      institutionsSection: {
        title: data.institutionsSection?.title || INITIAL_LANDING_PAGE_DATA.institutionsSection.title,
        institutions: data.institutionsSection?.institutions || INITIAL_LANDING_PAGE_DATA.institutionsSection.institutions,
      },
      updatedAt: data.updatedAt,
    };
  } catch {
    return getLocalData();
  }
}

export async function updateLandingPageData(data: LandingPageData): Promise<LandingPageData> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, '');
  
  // If there's an ID, we PUT, otherwise we POST (though there should normally be an ID if seeded)
  const id = data.id;
  const url = id ? `${baseUrl}/landing-page/${id}` : `${baseUrl}/landing-page`;
  const method = id ? 'PUT' : 'POST';

  // Always update local storage first to keep mock-mode working
  saveLocalData(data);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar no servidor. As alterações foram preservadas localmente.');
    }

    const payload = await response.json();
    return payload || getLocalData();
  } catch (error) {
    if (error instanceof Error && error.message.includes('salvar no servidor')) {
      throw error;
    }
    throw new Error('Servidor indisponível. As alterações foram preservadas localmente.');
  }
}
