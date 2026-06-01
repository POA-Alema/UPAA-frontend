import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    common: {
      map: {
        close_details: "Fechar detalhes da edificação",
        image_unavailable: "Imagem indisponível",
        mapped_building: "Edificação mapeada",
        page_unavailable: "Página da edificação ainda não disponível",
        see_more: "Ver Mais",
        year: "Ano",
        author: "Autoria",
        know_work: "Conhecer a obra",
        know_author: "Conhecer o autor",
        image_label: "Imagem",
        alert_recentered_outside_limit: "Você está fora da área útil do mapa. Recentralizando no Centro Histórico.",
        alert_recentered_permission_denied: "Permissão de geolocalização negada. Exibindo o mapa centralizado no Centro Histórico.",
        alert_geolocation_unavailable: "Geolocalização não disponível. Exibindo o mapa centralizado no Centro Histórico.",
        no_markers_message: "Nenhum ponto disponivel para exibir.",
        load_error_message: "Nao foi possivel carregar os dados do mapa.",
      }
    }
  },
  en: {
    common: {
      map: {
        close_details: "Close building details",
        image_unavailable: "Image unavailable",
        mapped_building: "Mapped building",
        page_unavailable: "Building page not yet available",
        see_more: "See More",
        year: "Year",
        author: "Author",
        know_work: "Discover the work",
        know_author: "Discover the author",
        image_label: "Image",
        alert_recentered_outside_limit: "You are outside the useful map area. Recentering to the Historic Center.",
        alert_recentered_permission_denied: "Location permission denied. Showing the map centered on the Historic Center.",
        alert_geolocation_unavailable: "Geolocation unavailable. Showing the map centered on the Historic Center.",
        no_markers_message: "No points available to display.",
        load_error_message: "Unable to load the map data.",
      }
    }
  },
  de: {
    common: {
      map: {
        close_details: "Gebäudedetails schließen",
        image_unavailable: "Bild nicht verfügbar",
        mapped_building: "Kartiertes Gebäude",
        page_unavailable: "Gebäudeseite noch nicht verfügbar",
        see_more: "Mehr sehen",
        year: "Jahr",
        author: "Autor",
        know_work: "Das Werk entdecken",
        know_author: "Den Autor kennenlernen",
        image_label: "Bild",
        alert_recentered_outside_limit: "Sie befinden sich außerhalb des nützlichen Kartenbereichs. Karte wird auf das historische Zentrum zentriert.",
        alert_recentered_permission_denied: "Standortberechtigung verweigert. Karte wird auf das historische Zentrum zentriert.",
        alert_geolocation_unavailable: "Geolokalisierung nicht verfügbar. Karte wird auf das historische Zentrum zentriert.",
        no_markers_message: "Keine Punkte zum Anzeigen verfügbar.",
        load_error_message: "Karten-Daten konnten nicht geladen werden.",
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',// DEFAULT LANGUAGE - TESTS
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;