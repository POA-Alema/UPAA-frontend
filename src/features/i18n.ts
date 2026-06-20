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
        image_label: "Imagem"
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
          analysis: "Analise"
        }
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
        image_label: "Image"
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
          analysis: "Analysis"
        }
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
        image_label: "Bild"
      },
      building_materials: {
        title: "Materialgalerie",
        slide_hint: "Wischen",
        list_label: "Zusaetzliche Gebaeudematerialien",
        open_label: "{{type}} oeffnen: {{title}}",
        empty: "Keine zusaetzlichen Materialien registriert.",
        types: {
          plant: "Plan",
          document: "Dokument",
          analysis: "Analyse"
        }
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
