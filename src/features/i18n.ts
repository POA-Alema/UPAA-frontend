import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    common: {
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
        fallback: "Dados reais indisponiveis. Exibindo pontos de referencia.",
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
        map_placeholder: "Integração com o mapa será conectada assim que a feature correspondente estiver disponível."
      },
      image: {
        expand: "Ampliar imagem",
        close: "Fechar imagem ampliada",
        source: "Fonte",
        reference: "Referência",
        credits: "Créditos",
      },
    },
  },
  en: {
    common: {
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
        map_placeholder: "Map integration will be connected as soon as the corresponding feature is available."
      },
      image: {
        expand: "Expand image",
        close: "Close expanded image",
        source: "Source",
        reference: "Reference",
        credits: "Credits",
      },
    },
  },
  de: {
    common: {
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
        map_placeholder: "Die Kartenintegration wird verfügbar sein, sobald die entsprechende Funktion bereitsteht."
      },
      image: {
        expand: "Bild vergrößern",
        close: "Vergrößertes Bild schließen",
        source: "Quelle",
        reference: "Referenz",
        credits: "Bildnachweis",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
