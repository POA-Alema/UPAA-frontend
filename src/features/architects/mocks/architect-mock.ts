import { ArchitectBioProps } from "../types/architect";

export const theodorWiederspahnMock: ArchitectBioProps = {
  eyebrow: "O Arquiteto da Elegância",
  title: "O Legado de Theodor Wiederspahn",
  bio: "Theodor Alexander Josef Wiederspahn, também conhecido como Theo Wiederspahn, foi um arquiteto germano-brasileiro nascido em 1878, em Wiesbaden, na Alemanha, e falecido em 1952. Ele se destacou sobretudo no Rio Grande do Sul, especialmente em Porto Alegre, onde se tornou um dos nomes mais importantes da arquitetura eclética no início do século XX. Sua obra marcou a paisagem urbana da capital gaúcha, com projetos ligados a prédios públicos, comerciais e institucionais que até hoje são referências históricas da cidade.",
  image: {
      src: "/images/theodoro.png", 
      alt: "Theodor Wiederspahn",
    },
  cta: {
    label: "Explorar Obras",
    href: "/edificacoes",
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
};
