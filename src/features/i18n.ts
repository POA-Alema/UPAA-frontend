import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = ["pt", "de", "en"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "pt";

function isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
  return Boolean(
    language &&
      SUPPORTED_LANGUAGES.includes(language.split("-")[0] as SupportedLanguage),
  );
}

export function normalizeLanguage(language: string | null | undefined): SupportedLanguage {
  if (!isSupportedLanguage(language)) {
    return DEFAULT_LANGUAGE;
  }

  return language.split("-")[0] as SupportedLanguage;
}

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    return normalizeLanguage(window.localStorage.getItem("i18nextLng"));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export const resources = {
  pt: {
    common: {
      layout: {
        logo_parts: ["Uma", "Porto Alegre", "Alema"],
        actions: {
          map: "Mapa",
          home: "Home",
        },
        sections: {
          intro: "Introducao",
          immigration: "Imigracao",
          "map-preview": "Mapa",
          architects: "Arquitetos",
        },
        languages: {
          pt: "Portugues",
          de: "Deutsch",
          en: "English",
        },
        menu_label: "Menu",
        footer_title: "Uma Porto Alegre Alema",
        footer_subtitle:
          "Explorando a heranca arquitetonica alema no centro historico de Porto Alegre.",
        project_line: "Projeto Academico desenvolvido na PUCRS",
      },
      landing: {
        title: "O Legado Alemao na Arquitetura de Porto Alegre",
        description:
          "Explorando as obras que transformaram a capital gaucha.",
        empty: "Nenhum conteudo disponivel no momento",
        intro_description:
          "Explore no mapa as obras que transformaram Porto Alegre e descubra as narrativas por tras da arquitetura germanica da cidade.",
        map_preview_alt:
          "Mapa de Porto Alegre com destaque para alguns edificios de estilo germanico.",
        map_cta: "Explorar Mapa",
      },
      map: {
        close_details: "Fechar detalhes da edificacao",
        image_unavailable: "Imagem indisponivel",
        mapped_building: "Edificacao mapeada",
        empty_points: "Nenhum ponto disponivel para exibir.",
        load_error: "Nao foi possivel carregar os dados do mapa.",
        page_unavailable: "Pagina da edificacao ainda nao disponivel",
        see_more: "Ver Mais",
        year: "Ano",
        author: "Autoria",
        know_work: "Conhecer a obra",
        know_author: "Conhecer o autor",
        image_label: "Imagem",
      },
      building_detail: {
        eyebrow: "Edificacao",
        description: "Descricao",
        content_title: "Edificacao",
        map_title: "Mapa",
        map_pending:
          "Integracao com o mapa sera conectada assim que a feature correspondente estiver disponivel.",
        not_found_title: "Edificacao nao encontrada | UPAA Frontend",
        metadata_description:
          "Estrutura inicial da pagina {{title}}.",
      },
      building_materials: {
        title: "Galeria de materiais",
        slide_hint: "Deslize",
        list_label: "Materiais adicionais da edificacao",
        open_label: "Abrir {{type}}: {{title}}",
        empty: "Nenhum material adicional cadastrado.",
        types: {
          plant: "Planta",
          document: "Documento",
          analysis: "Analise",
        },
      },
    },
  },
  en: {
    common: {
      layout: {
        logo_parts: ["A", "Porto Alegre", "German"],
        actions: {
          map: "Map",
          home: "Home",
        },
        sections: {
          intro: "Intro",
          immigration: "Immigration",
          "map-preview": "Map",
          architects: "Architects",
        },
        languages: {
          pt: "Portugues",
          de: "Deutsch",
          en: "English",
        },
        menu_label: "Menu",
        footer_title: "A German Porto Alegre",
        footer_subtitle:
          "Exploring German architectural heritage in Porto Alegre's historic center.",
        project_line: "Academic project developed at PUCRS",
      },
      landing: {
        title: "The German Legacy in the Architecture of Porto Alegre",
        description:
          "Exploring the works that transformed the capital of Rio Grande do Sul.",
        empty: "No content available at the moment",
        intro_description:
          "Explore the map to find the works that transformed Porto Alegre and discover the stories behind the city's Germanic architecture.",
        map_preview_alt:
          "Preview map of Porto Alegre focused on Germanic-style buildings.",
        map_cta: "Explore Map",
      },
      map: {
        close_details: "Close building details",
        image_unavailable: "Image unavailable",
        mapped_building: "Mapped building",
        empty_points: "No points available to display.",
        load_error: "Could not load map data.",
        page_unavailable: "Building page not yet available",
        see_more: "See More",
        year: "Year",
        author: "Author",
        know_work: "Discover the work",
        know_author: "Discover the author",
        image_label: "Image",
      },
      building_detail: {
        eyebrow: "Building",
        description: "Description",
        content_title: "Building",
        map_title: "Map",
        map_pending:
          "Map integration will be connected when the corresponding feature is available.",
        not_found_title: "Building not found | UPAA Frontend",
        metadata_description:
          "Initial structure for the {{title}} page.",
      },
      building_materials: {
        title: "Materials gallery",
        slide_hint: "Slide",
        list_label: "Additional building materials",
        open_label: "Open {{type}}: {{title}}",
        empty: "No additional materials registered.",
        types: {
          plant: "Floor plan",
          document: "Document",
          analysis: "Analysis",
        },
      },
    },
  },
  de: {
    common: {
      layout: {
        logo_parts: ["Ein", "Porto Alegre", "Deutsch"],
        actions: {
          map: "Karte",
          home: "Start",
        },
        sections: {
          intro: "Einfuhrung",
          immigration: "Immigration",
          "map-preview": "Karte",
          architects: "Architekten",
        },
        languages: {
          pt: "Portugues",
          de: "Deutsch",
          en: "English",
        },
        menu_label: "Menu",
        footer_title: "Ein deutsches Porto Alegre",
        footer_subtitle:
          "Erkundung des deutsch beeinflussten architektonischen Erbes im historischen Zentrum von Porto Alegre.",
        project_line: "Akademisches Projekt an der PUCRS",
      },
      landing: {
        title: "Das deutsche Erbe in der Architektur von Porto Alegre",
        description:
          "Erkundung der Bauwerke, die die Hauptstadt von Rio Grande do Sul gepragt haben.",
        empty: "Derzeit sind keine Inhalte verfugbar",
        intro_description:
          "Erkunden Sie auf der Karte die Bauwerke, die Porto Alegre gepragt haben, und entdecken Sie die Geschichten hinter der deutsch gepragten Architektur der Stadt.",
        map_preview_alt:
          "Vorschaukarte von Porto Alegre mit Fokus auf Gebaude germanischen Stils.",
        map_cta: "Karte erkunden",
      },
      map: {
        close_details: "Gebaudedetails schliessen",
        image_unavailable: "Bild nicht verfugbar",
        mapped_building: "Kartiertes Gebaude",
        empty_points: "Keine Punkte zur Anzeige verfugbar.",
        load_error: "Kartendaten konnten nicht geladen werden.",
        page_unavailable: "Gebaudeseite noch nicht verfugbar",
        see_more: "Mehr sehen",
        year: "Jahr",
        author: "Autor",
        know_work: "Das Werk entdecken",
        know_author: "Den Autor kennenlernen",
        image_label: "Bild",
      },
      building_detail: {
        eyebrow: "Gebaude",
        description: "Beschreibung",
        content_title: "Gebaude",
        map_title: "Karte",
        map_pending:
          "Die Kartenintegration wird verbunden, sobald die entsprechende Funktion verfugbar ist.",
        not_found_title: "Gebaude nicht gefunden | UPAA Frontend",
        metadata_description:
          "Anfangsstruktur der Seite {{title}}.",
      },
      building_materials: {
        title: "Materialgalerie",
        slide_hint: "Wischen",
        list_label: "Zusatzliche Gebaudematerialien",
        open_label: "{{type}} offnen: {{title}}",
        empty: "Keine zusatzlichen Materialien registriert.",
        types: {
          plant: "Plan",
          document: "Dokument",
          analysis: "Analyse",
        },
      },
    },
  },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });
}

export default i18n;
