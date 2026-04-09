import type { Architect } from "../types/architect";

/**
 * Mock data for architects.
 * Provides sample architect data structures for development, testing, and demonstration purposes.
 * This helps ensure components work correctly before integrating with real CMS data.
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
  
  characteristics: [
    {
      icon: "auto_awesome",
      title: "Ecletismo Monumental",
      description: "Sua obra é caracterizada pela fusão harmônica entre o neoclássico e o barroco, definindo o horizonte da capital gaúcha através de proporções imponentes e riqueza ornamental."
    },
    {
      icon: "palette",
      title: "Riqueza de Detalhes",
      description: "Colaboração constante com artistas e escultores como Alfred Adloff, resultando em fachadas com figuras alegóricas e elementos decorativos de alta qualidade técnica."
    },
    {
      icon: "domain",
      title: "Inovação Estrutural",
      description: "Pioneiro no uso de novas tecnologias construtivas para a época, como grandes vãos, claraboias zenitais e estruturas que permitiam ambientes amplos e iluminados."
    }
  ],
  works: [
    {
      title: "Museu de Arte do RS",
      image: {
        src: "/images/Margs.jpg",
        alt: "Fachada do Museu de Arte do Rio Grande do Sul",
        caption: "Antiga Delegacia Fiscal em Porto Alegre" 
      }
    },
    {
      title: "Memorial do RS",
      image: {
        src: "/images/Memorial RS.jpg",
        alt: "Fachada do Memorial do Rio Grande do Sul",
        caption: "Antigos Correios e Telégrafos" 
      }
    }
  ],
  ctaDescription: "A herança de Wiederspahn está espalhada pelo centro de Porto Alegre, esperando para ser descoberta em cada detalhe de suas fachadas.",
  // End of Theodor Wiederspahn mock data configuration

  actions: {
    primary: {
      label: "Ver Biografia",
      href: "/architects/theodor-wiederspahn",
    },
    secondary: {
      label: "Explorar Obras", 
      href: "/architects/theodor-wiederspahn/obras",
    },
  },
};

export const architectsMock: Architect[] = [theodorWiederspahnMock];

export function getArchitectBySlug(slug: string): Architect | undefined {
  return architectsMock.find((architect) => architect.slug === slug);
}
