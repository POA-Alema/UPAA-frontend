import { s3ImageUrl } from "@/lib/s3";
import type { Architect } from "../types/architect";

// Texto livre placeholder (será substituído por rich text vindo do CMS).
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export const architectsMock: Architect[] = [
  {
    id: "theodor-wiederspahn",
    slug: "theodor-wiederspahn",
    eyebrow: "O Arquiteto da Elegância",
    title: "Theodor Wiederspahn",
    bioSummary:
      "Arquiteto germano-brasileiro (1878-1952) que se destacou em Porto Alegre, deixando um legado marcante na arquitetura eclética do início do século XX.",
    bio: `Theodor Alexander conhecido como Theo Wiederspahn, também Wiederspahn, foi um arquiteto germano-brasileiro nascido em 1878, em Wiesbaden, na Alemanha, e falecido em 1952. Ele se destacou sobretudo no Rio Grande do Sul, especialmente em Porto Alegre, onde se tornou um dos nomes mais importantes da arquitetura eclética no início do século XX.

Sua obra marcou a paisagem urbana da capital gaúcha, com projetos ligados a prédios públicos, comerciais e institucionais que até hoje são referências históricas da cidade.`,
    image: {
      src: s3ImageUrl("images/theodor.png"),
      alt: "Theodor Wiederspahn",
      caption: "Theodor Wiederspahn, um dos maiores nomes da arquitetura gaúcha.",
      title: "Theodor Wiederspahn",
      description: LOREM,
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
    characteristics: [
      {
        icon: "auto_awesome",
        title: "Ecletismo Monumental",
        description:
          "Sua obra é caracterizada pela fusão harmônica entre o neoclássico e o barroco, definindo o horizonte da capital gaúcha através de proporções imponentes e riqueza ornamental.",
      },
      {
        icon: "palette",
        title: "Riqueza de Detalhes",
        description:
          "Colaboração constante com artistas e escultores como Alfred Adloff, resultando em fachadas com figuras alegóricas e elementos decorativos de alta qualidade técnica.",
      },
      {
        icon: "domain",
        title: "Inovação Estrutural",
        description:
          "Pioneiro no uso de novas tecnologias construtivas para a época, como grandes vãos, claraboias zenitais e estruturas que permitiam ambientes amplos e iluminados.",
      },
    ],
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
    ctaDescription:
      "A herança de Wiederspahn está espalhada pelo centro de Porto Alegre, esperando para ser descoberta em cada detalhe de suas fachadas.",
    actions: {
      primary: {
        label: "Ver Biografia",
        href: "/architects/theodor-wiederspahn",
      },
      secondary: {
        label: "Explorar Obras",
      },
    },
  },
];
