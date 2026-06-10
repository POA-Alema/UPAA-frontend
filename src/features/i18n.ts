import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  pt: {
    common: {
      nav: {
        section_intro: "Introdução",
        section_immigration: "Imigração",
        section_map: "Mapa",
        section_architects: "Arquitetos",
      },

      header: {
        logo_line1: "Uma",
        logo_line2: "Porto Alegre",
        logo_line3: "Alemã",
        action_map: "Mapa",
        action_home: "Home",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Idioma definido pelo usuário",
        language_source_browser: "Idioma detectado pelo navegador",
        language_source_default: "Idioma padrão aplicado",
      },

      footer: {
        title: "Uma Porto Alegre Alemã",
        subtitle:
          "Explorando a herança arquitetônica alemã no centro histórico de Porto Alegre.",
        project_line: "Projeto Acadêmico desenvolvido na PUCRS",
      },

      home: {
        intro_description:
          "Explore no mapa as obras que transformaram Porto Alegre e descubra como esse legado ainda marca a paisagem da cidade.",
        intro_cta: "Explorar Mapa",
        map_preview_alt:
          "Mapa de Porto Alegre com destaque para alguns edifícios de estilo germânico.",
        no_content: "Nenhum conteúdo disponível no momento",
      },

      map: {
        close_details: "Fechar detalhes da edificação",
        image_unavailable: "Imagem indisponível",
        mapped_building: "Edificação mapeada",
        page_unavailable: "Página da edificação ainda não disponível",
        see_more: "Ver mais",
        year: "Ano",
        author: "Autoria",
        know_work: "Conhecer a obra",
        know_author: "Conhecer o autor",
        open_route: "Abrir rota",
        open_route_aria: "Abrir rota em aplicativo de navegação",
        image_label: "Imagem",
        loading: "Carregando dados do mapa.",
        empty: "Nenhum ponto disponivel para exibir.",
        load_error: "Nao foi possivel carregar os dados do mapa.",
        fallback:
          "Dados reais indisponiveis. Exibindo pontos de referencia.",
        you_are_here: "Voce esta aqui",
        alert_recentered_outside_limit:
          "Você está fora da área útil do mapa. Recentralizando no Centro Histórico.",
        alert_recentered_permission_denied:
          "Permissão de geolocalização negada. Exibindo o mapa centralizado no Centro Histórico.",
        alert_geolocation_unavailable:
          "Geolocalização não disponível. Exibindo o mapa centralizado no Centro Histórico.",
      },

      building: {
        section_title: "Edificação",
        map_title: "Mapa",
        map_placeholder:
          "Integração com o mapa será conectada assim que a feature correspondente estiver disponível.",
      },
      image: {
        expand: "Ampliar imagem",
        close: "Fechar imagem ampliada",
      },
    },
  },

  en: {
    common: {
      nav: {
        section_intro: "Intro",
        section_immigration: "Immigration",
        section_map: "Map",
        section_architects: "Architects",
      },

      header: {
        logo_line1: "A",
        logo_line2: "Porto Alegre",
        logo_line3: "German",
        action_map: "Map",
        action_home: "Home",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Language set by user",
        language_source_browser: "Language detected from browser",
        language_source_default: "Default language applied",
      },

      footer: {
        title: "A Germanic Porto Alegre",
        subtitle:
          "Exploring Germanic architectural heritage in Porto Alegre historic center.",
        project_line: "Academic project developed at PUCRS",
      },

      home: {
        intro_description:
          "Explore on the map the works that transformed Porto Alegre and discover how this legacy still shapes the city's landscape.",
        intro_cta: "Explore Map",
        map_preview_alt:
          "Preview map of Porto Alegre with a focus on some germanic buildings",
        no_content: "No content available at the moment",
      },

      map: {
        close_details: "Close building details",
        image_unavailable: "Image unavailable",
        mapped_building: "Mapped building",
        page_unavailable: "Building page not yet available",
        see_more: "See more",
        year: "Year",
        author: "Author",
        know_work: "Discover the work",
        know_author: "Discover the author",
        open_route: "Open route",
        open_route_aria: "Open route in navigation app",
        image_label: "Image",
        loading: "Loading map data.",
        empty: "No points available to display.",
        load_error: "Unable to load map data.",
        fallback: "Live data unavailable. Showing reference points.",
        you_are_here: "You are here",
        alert_recentered_outside_limit:
          "You are outside the useful map area. Recentering to the Historic Center.",
        alert_recentered_permission_denied:
          "Location permission denied. Showing the map centered on the Historic Center.",
        alert_geolocation_unavailable:
          "Geolocation unavailable. Showing the map centered on the Historic Center.",
      },

      building: {
        section_title: "Building",
        map_title: "Map",
        map_placeholder:
          "Map integration will be connected as soon as the corresponding feature is available.",
      },
      image: {
        expand: "Expand image",
        close: "Close expanded image",
      },
    },
  },

  de: {
    common: {
      nav: {
        section_intro: "Einführung",
        section_immigration: "Immigration",
        section_map: "Karte",
        section_architects: "Architekten",
      },

      header: {
        logo_line1: "Ein",
        logo_line2: "Porto Alegre",
        logo_line3: "Deutsch",
        action_map: "Karte",
        action_home: "Start",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Sprache vom Benutzer festgelegt",
        language_source_browser: "Sprache vom Browser erkannt",
        language_source_default: "Standardsprache angewendet",
      },

      footer: {
        title: "Ein deutsches Porto Alegre",
        subtitle:
          "Erkunden des deutsch beeinflussten architektonischen Erbes im historischen Zentrum von Porto Alegre.",
        project_line: "Akademisches Projekt an der PUCRS",
      },

      home: {
        intro_description:
          "Erkunden Sie auf der Karte die Werke, die Porto Alegre verwandelt haben, und entdecken Sie, wie dieses Erbe die Stadtlandschaft noch heute prägt.",
        intro_cta: "Karte Erkunden",
        map_preview_alt:
          "Vorschaukarte von Porto Alegre mit Schwerpunkt auf einigen germanischen Gebäuden",
        no_content: "Derzeit keine Inhalte verfügbar",
      },

      map: {
        close_details: "Gebäudedetails schließen",
        image_unavailable: "Bild nicht verfuegbar",
        mapped_building: "Kartiertes Gebäude",
        page_unavailable: "Gebäudeseite noch nicht verfügbar",
        see_more: "Mehr sehen",
        year: "Jahr",
        author: "Autor",
        know_work: "Das Werk entdecken",
        know_author: "Den Autor kennenlernen",
        open_route: "Route öffnen",
        open_route_aria: "Route in Navigations-App öffnen",
        image_label: "Bild",
        loading: "Kartendaten werden geladen.",
        empty: "Keine Punkte zum Anzeigen verfuegbar.",
        load_error: "Kartendaten konnten nicht geladen werden.",
        fallback:
          "Echtzeitdaten nicht verfuegbar. Referenzpunkte werden angezeigt.",
        you_are_here: "Du bist hier",
        alert_recentered_outside_limit:
          "Sie befinden sich ausserhalb des nutzbaren Kartenbereichs. Karte wird auf das historische Zentrum zentriert.",
        alert_recentered_permission_denied:
          "Standortberechtigung verweigert. Karte wird auf das historische Zentrum zentriert.",
        alert_geolocation_unavailable:
          "Geolokalisierung nicht verfuegbar. Karte wird auf das historische Zentrum zentriert.",
      },

      building: {
        section_title: "Gebäude",
        map_title: "Karte",
        map_placeholder:
          "Die Kartenintegration wird verfügbar sein, sobald die entsprechende Funktion bereitsteht.",
      },
      image: {
        expand: "Bild vergrößern",
        close: "Vergrößertes Bild schließen",
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
