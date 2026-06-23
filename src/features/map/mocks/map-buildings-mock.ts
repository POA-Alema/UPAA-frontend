import { s3ImageUrl } from "@/lib/s3";
import type { Building } from "../utils/map-buildings";

// Texto livre placeholder (será substituído por rich text vindo do CMS).
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

type Lang = "pt" | "en" | "de";

const MARGS_SUMMARY: Record<Lang, string> = {
  pt: "Instalado em um prédio histórico da Praça da Alfândega, o Museu de Arte do Rio Grande do Sul, criado em 1954, é o principal museu de arte do estado e referência na preservação e difusão da produção artística gaúcha e brasileira.",
  en: "Housed in a historic building on Praça da Alfândega, the Museum of Art of Rio Grande do Sul, founded in 1954, is the main art museum in the state and a reference for the preservation and promotion of Rio Grande do Sul and Brazilian artistic production.",
  de: "Das 1954 gegründete Kunstmuseum von Rio Grande do Sul befindet sich in einem historischen Gebäude am Praça da Alfândega und ist das wichtigste Kunstmuseum des Bundesstaates sowie eine Referenz für die Bewahrung und Verbreitung der künstlerischen Produktion des Staates.",
};

const CCMQ_SUMMARY: Record<Lang, string> = {
  pt: "Antigo Hotel Majestic, a Casa de Cultura Mario Quintana é um importante centro cultural de Porto Alegre, inaugurado em 1990 após a restauração do prédio histórico construído entre 1916 e 1933. O espaço foi nomeado em homenagem ao poeta Mário Quintana, que viveu no local por anos. Hoje, representa um dos principais polos culturais da cidade, reunindo teatros, cinemas, bibliotecas e exposições, além de preservar a memória histórica e artística do Rio Grande do Sul.",
  en: "The former Hotel Majestic, the Casa de Cultura Mario Quintana is an important cultural center in Porto Alegre, inaugurated in 1990 after the restoration of the historic building constructed between 1916 and 1933. Named in honor of poet Mário Quintana, who lived there for years, it is today one of the city's main cultural hubs, bringing together theaters, cinemas, libraries and exhibitions.",
  de: "Das ehemalige Hotel Majestic, das Casa de Cultura Mario Quintana, ist ein bedeutendes Kulturzentrum in Porto Alegre, das 1990 nach der Restaurierung des zwischen 1916 und 1933 erbauten historischen Gebäudes eröffnet wurde. Es trägt den Namen des Dichters Mário Quintana und ist heute eines der wichtigsten Kulturzentren der Stadt mit Theatern, Kinos, Bibliotheken und Ausstellungen.",
};

function buildMapBuildingsMock(lang: Lang): Building[] {
  return [
    {
      id: 1,
      slug: "margs",
      name: "Museu de Arte do Rio Grande do Sul (MARGS)",
      district: "Centro Historico",
      summary: MARGS_SUMMARY[lang],
      yearLabel: "1912",
      architectName: "Theodor Wiederspahn",
      architectPath: "/architects/theodor-wiederspahn",
      attachments: [
        {
          src: s3ImageUrl("images/margs/Margs.jpg"),
          alt: "Fachada historica com ornamentos classicos",
          caption: "Visão externa do MARGS.",
          title: "Visão externa do MARGS",
          description: LOREM,
        },
        {
          src: s3ImageUrl("images/Margs_2.jpg"),
          alt: "Detalhe de fachada historica no centro de Porto Alegre",
          caption: "Visão interna da arquitetura do MARGS.",
          title: "Visão interna do MARGS",
          description: LOREM,
        },
      ],
      latitude: -30.029111,
      longitude: -51.231694,
    },
    {
      id: 2,
      slug: "casa-de-cultura-mario-quintana",
      name: "Casa de Cultura Mario Quintana (CCMQ)",
      district: "Centro Historico",
      summary: CCMQ_SUMMARY[lang],
      yearLabel: "1933",
      architectName: "Theodor Wiederspahn",
      architectPath: "/architects/theodor-wiederspahn",
      attachments: [
        {
          src: s3ImageUrl("images/cdcMarioQuintana.jpg"),
          alt: "Volume arquitetonico historico em tons quentes",
          caption: "Visão externa do CCMQ.",
          title: "Visão externa do CCMQ",
          description: LOREM,
        },
        {
          src: s3ImageUrl("images/cdcMarioQuintana_2.jpg"),
          alt: "Perspectiva urbana de arquitetura monumental",
          caption: "Visão interna da arquitetura do CCMQ.",
          title: "Visão interna do CCMQ",
          description: LOREM,
        },
      ],
      latitude: -30.0316,
      longitude: -51.231,
    },
  ];
}

export function getMapBuildingsMock(lang = "pt"): Building[] {
  const safeLang: Lang = lang === "en" || lang === "de" ? lang : "pt";
  return buildMapBuildingsMock(safeLang);
}

export const mapBuildingsMock: Building[] = getMapBuildingsMock("pt");
