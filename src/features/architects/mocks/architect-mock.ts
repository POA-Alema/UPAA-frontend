import { Architect } from "../types/architect";

/**
 * Mock de dados para os arquitetos
 */
export const theodorWiederspahnMock: Architect = {
  id: "theodor-wiederspahn",
  slug: "theodor-wiederspahn",
  eyebrow: "O Arquiteto da Elegância",
  title: "Theodor Wiederspahn",
  bioSummary:
    "Arquiteto germano-brasileiro (1878-1952) que se destacou em Porto Alegre, deixando um legado marcante na arquitetura eclética do início do século XX.",
  bio: "Theodor Alexander conhecido como Theo Wiederspahn, também Wiederspahn, foi um arquiteto germano-brasileiro nascido em 1878, em Wiesbaden, na Alemanha, e falecido em 1952. Ele se destacou sobretudo no Rio Grande do Sul, especialmente em Porto Alegre, onde se tornou um dos nomes mais importantes da arquitetura eclética no início do século XX. Sua obra marcou a paisagem urbana da capital gaúcha, com projetos ligados a prédios públicos, comerciais e institucionais que até hoje são referências históricas da cidade.",
  image: {
    src: "/images/theodoro.png",
    alt: "Theodor Wiederspahn",
    caption: "Theodor Wiederspahn, um dos maiores nomes da arquitetura gaúcha.", 
  },
  details: [
    {
      label: "Origem",
      value: "Wiesbaden, Alemanha",
      subValue: "Nascimento: 1878",
    },
    {
      label: "Morte",
      value: "Porto Alegre, Brasil",
      subValue: "Falecimento: 1952",
    },
  ],
  actions: {
    primary: {
      label: "Ver Biografia",
      href: "/architects/theodor-wiederspahn",
    },
    secondary: {
      label: "Ver Obras",
      href: "/architects/theodor-wiederspahn/obras",
    },
  },
};

export const architectsMock: Architect[] = [theodorWiederspahnMock];

export function getArchitectBySlug(slug: string): Architect | undefined {
  return architectsMock.find((architect) => architect.slug === slug);
}