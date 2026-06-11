import type { BuildingLanguage } from "./buildings";

export const buildingLabels = {
  pt: {
    history: "Histórico",
    characteristics: "Características Arquitetônicas",
    gallery: "Galeria de Fotos",
    architect: "O Arquiteto",
    backToMap: "Voltar ao mapa",
    previous: "Anterior",
    next: "Próximo",
    goToPage: (page: number) => `Ir para página ${page}`,
    unavailable: "Edificação indisponível",
    notFoundTitle: "Não foi possível carregar esta edificação",
    notFoundDescription:
      "O endereço pode estar incorreto ou os dados podem estar temporariamente indisponíveis.",
  },
  en: {
    history: "History",
    characteristics: "Architectural Characteristics",
    gallery: "Photo Gallery",
    architect: "The Architect",
    backToMap: "Back to map",
    previous: "Previous",
    next: "Next",
    goToPage: (page: number) => `Go to page ${page}`,
    unavailable: "Building unavailable",
    notFoundTitle: "This building could not be loaded",
    notFoundDescription:
      "The address may be incorrect or the data may be temporarily unavailable.",
  },
  de: {
    history: "Geschichte",
    characteristics: "Architektonische Merkmale",
    gallery: "Fotogalerie",
    architect: "Der Architekt",
    backToMap: "Zurück zur Karte",
    previous: "Zurück",
    next: "Weiter",
    goToPage: (page: number) => `Gehe zu Seite ${page}`,
    unavailable: "Gebäude nicht verfügbar",
    notFoundTitle: "Dieses Gebäude konnte nicht geladen werden",
    notFoundDescription:
      "Die Adresse ist möglicherweise falsch oder die Daten sind vorübergehend nicht verfügbar.",
  },
} as const satisfies Record<BuildingLanguage, object>;
