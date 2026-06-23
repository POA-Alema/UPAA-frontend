import { s3ImageUrl } from "@/lib/s3";
import type { Architect } from "../types/architect";

// Texto livre placeholder (será substituído por rich text vindo do CMS).
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

type Lang = "pt" | "en" | "de";

const THEODOR: Record<Lang, Pick<Architect, "eyebrow" | "bioSummary" | "bio"> & { imageCaption: string }> = {
  pt: {
    eyebrow: "O Arquiteto da Elegância",
    bioSummary:
      "Arquiteto germano-brasileiro (1878-1952) que se destacou em Porto Alegre, deixando um legado marcante na arquitetura eclética do início do século XX.",
    bio: `Theodor Alexander conhecido como Theo Wiederspahn, também Wiederspahn, foi um arquiteto germano-brasileiro nascido em 1878, em Wiesbaden, na Alemanha, e falecido em 1952. Ele se destacou sobretudo no Rio Grande do Sul, especialmente em Porto Alegre, onde se tornou um dos nomes mais importantes da arquitetura eclética no início do século XX.

Sua obra marcou a paisagem urbana da capital gaúcha, com projetos ligados a prédios públicos, comerciais e institucionais que até hoje são referências históricas da cidade.`,
    imageCaption: "Theodor Wiederspahn, um dos maiores nomes da arquitetura gaúcha.",
  },
  en: {
    eyebrow: "The Architect of Elegance",
    bioSummary:
      "German-Brazilian architect (1878-1952) who stood out in Porto Alegre, leaving a remarkable legacy in the eclectic architecture of the early 20th century.",
    bio: `Theodor Alexander, known as Theo Wiederspahn, was a German-Brazilian architect born in 1878 in Wiesbaden, Germany, and died in 1952. He stood out especially in Rio Grande do Sul, particularly in Porto Alegre, where he became one of the most important names in eclectic architecture in the early 20th century.

His work marked the urban landscape of the state capital, with projects for public, commercial and institutional buildings that remain historical references of the city to this day.`,
    imageCaption: "Theodor Wiederspahn, one of the greatest names in Rio Grande do Sul architecture.",
  },
  de: {
    eyebrow: "Der Architekt der Eleganz",
    bioSummary:
      "Deutsch-brasilianischer Architekt (1878-1952), der sich in Porto Alegre hervortat und ein bemerkenswertes Erbe in der eklektischen Architektur des frühen 20. Jahrhunderts hinterließ.",
    bio: `Theodor Alexander, bekannt als Theo Wiederspahn, war ein deutsch-brasilianischer Architekt, geboren 1878 in Wiesbaden, Deutschland, und gestorben 1952. Er zeichnete sich vor allem in Rio Grande do Sul aus, insbesondere in Porto Alegre, wo er zu einem der bedeutendsten Namen der eklektischen Architektur des frühen 20. Jahrhunderts wurde.

Sein Werk prägte das Stadtbild der Landeshauptstadt mit Projekten für öffentliche, gewerbliche und institutionelle Gebäude, die bis heute historische Referenzen der Stadt sind.`,
    imageCaption: "Theodor Wiederspahn, einer der größten Namen der Architektur von Rio Grande do Sul.",
  },
};

function buildTheodorMock(lang: Lang): Architect {
  const { eyebrow, bioSummary, bio, imageCaption } = THEODOR[lang];
  return {
    id: "theodor-wiederspahn",
    slug: "theodor-wiederspahn",
    eyebrow,
    title: "Theodor Wiederspahn",
    bioSummary,
    bio,
    image: {
      src: s3ImageUrl("images/theodor.png"),
      alt: "Theodor Wiederspahn",
      caption: imageCaption,
      title: "Theodor Wiederspahn",
      description: LOREM,
    },
    works: [
      {
        title: "Museu de Arte do RS",
        href: "/buildings/margs",
        image: {
          src: s3ImageUrl("images/margs/Margs.jpg"),
          alt: "Fachada do Museu de Arte do Rio Grande do Sul",
          caption: "Antiga Delegacia Fiscal em Porto Alegre",
          title: "Museu de Arte do RS",
          description: LOREM,
        },
      },
      {
        title: "Memorial do RS",
        image: {
          src: s3ImageUrl("images/Memorial RS.jpg"),
          alt: "Fachada do Memorial do Rio Grande do Sul",
          caption: "Antigos Correios e Telégrafos",
          title: "Memorial do RS",
          description: LOREM,
        },
      },
    ],
    actions: {
      primary: {
        label: "Ver Biografia",
        href: "/architects/theodor-wiederspahn",
      },
      secondary: {
        label: "Explorar Obras",
      },
    },
  };
}

export function getArchitectsMock(lang = "pt"): Architect[] {
  const safeLang: Lang = lang === "en" || lang === "de" ? lang : "pt";
  return [buildTheodorMock(safeLang)];
}

export const architectsMock: Architect[] = getArchitectsMock("pt");
