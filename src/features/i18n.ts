import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    common: {
      map: {
        close_details: "Fechar detalhes da edificacao",
        image_unavailable: "Imagem indisponivel",
        mapped_building: "Edificacao mapeada",
        page_unavailable: "Pagina da edificacao ainda nao disponivel",
        see_more: "Ver mais",
        year: "Ano",
        author: "Autoria",
        know_work: "Conhecer a obra",
        know_author: "Conhecer o autor",
        image_label: "Imagem",
        loading: "Carregando dados do mapa.",
        empty: "Nenhum ponto disponivel para exibir.",
        load_error: "Nao foi possivel carregar os dados do mapa.",
        fallback: "Dados reais indisponiveis. Exibindo pontos de referencia.",
        you_are_here: "Voce esta aqui",
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
        image_label: "Image",
        loading: "Loading map data.",
        empty: "No points available to display.",
        load_error: "Unable to load map data.",
        fallback: "Live data unavailable. Showing reference points.",
        you_are_here: "You are here",
      },
    },
  },
  de: {
    common: {
      map: {
        close_details: "Gebaeudedetails schliessen",
        image_unavailable: "Bild nicht verfuegbar",
        mapped_building: "Kartiertes Gebaeude",
        page_unavailable: "Gebaeudeseite noch nicht verfuegbar",
        see_more: "Mehr sehen",
        year: "Jahr",
        author: "Autor",
        know_work: "Das Werk entdecken",
        know_author: "Den Autor kennenlernen",
        image_label: "Bild",
        loading: "Kartendaten werden geladen.",
        empty: "Keine Punkte zum Anzeigen verfuegbar.",
        load_error: "Kartendaten konnten nicht geladen werden.",
        fallback: "Echtzeitdaten nicht verfuegbar. Referenzpunkte werden angezeigt.",
        you_are_here: "Du bist hier",
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
