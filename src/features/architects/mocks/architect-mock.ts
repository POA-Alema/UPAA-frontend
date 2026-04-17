import type { Architect } from "../types/architect";

export const architectsMock: any[] = [ // Usei any aqui para evitar conflito com o type antigo enquanto você não o atualiza
  {
    id: "theodor-wiederspahn",
    slug: "theodor-wiederspahn",
    eyebrow: {
      pt: "O Arquiteto da Elegância",
      en: "The Architect of Elegance",
      de: "Der Architekt der Eleganz"
    },
    title: "Theodor Wiederspahn",
    bioSummary: {
      pt: "Arquiteto germano-brasileiro (1878-1952) que se destacou em Porto Alegre, deixando um legado marcante na arquitetura eclética.",
      en: "German-Brazilian architect (1878-1952) who stood out in Porto Alegre, leaving a significant legacy in eclectic architecture.",
      de: "Deutsch-brasilianischer Architekt (1878-1952), der in Porto Alegre herausragte und ein bedeutendes Erbe in der eklektischen Architektur hinterließ."
    },
    bio: {
      pt: `Theodor Alexander conhecido como Theo Wiederspahn, também Wiederspahn, foi um arquiteto germano-brasileiro nascido em 1878, em Wiesbaden, na Alemanha, e falecido em 1952. Ele se destacou sobretudo no Rio Grande do Sul, especialmente em Porto Alegre, onde se tornou um dos nomes mais importantes da arquitetura eclética no início do século XX.

Sua obra marcou a paisagem urbana da capital gaúcha, com projetos ligados a prédios públicos, comerciais e institucionais que até hoje são referências históricas da cidade.`,
      en: `Theodor Alexander, known as Theo Wiederspahn, was a German-Brazilian architect born in 1878 in Wiesbaden, Germany, and passed away in 1952. He stood out primarily in Rio Grande do Sul, especially in Porto Alegre, where he became one of the most important names in eclectic architecture in the early 20th century.

His work marked the urban landscape of the state capital, with projects involving public, commercial, and institutional buildings that remain historical landmarks of the city today.`,
      de: `Theodor Alexander, bekannt als Theo Wiederspahn, war ein deutsch-brasilianischer Architekt, der 1878 in Wiesbaden, Deutschland, geboren wurde und 1952 verstarb. Er zeichnete sich vor allem in Rio Grande do Sul aus, insbesondere in Porto Alegre, wo er zu einem der bedeutendsten Namen der eklektischen Architektur des frühen 20. Jahrhunderts wurde.

Sein Werk prägte das Stadtbild der Landeshauptstadt mit Projekten für öffentliche, gewerbliche und institutionelle Gebäude, die bis heute historische Referenzen der Stadt sind.`
    },
    image: {
      src: "/images/theodor.png",
      alt: "Theodor Wiederspahn",
      caption: {
        pt: "Theodor Wiederspahn, um dos maiores nomes da arquitetura gaúcha.",
        en: "Theodor Wiederspahn, one of the greatest names in local architecture.",
        de: "Theodor Wiederspahn, einer der größten Namen der lokalen Architektur."
      },
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
        title: {
          pt: "Ecletismo Monumental",
          en: "Monumental Eclecticism",
          de: "Monumentaler Eklektizismus"
        },
        description: {
          pt: "Sua obra é caracterizada pela fusão harmônica entre o neoclássico e o barroco.",
          en: "His work is characterized by the harmonic fusion between Neoclassical and Baroque.",
          de: "Sein Werk zeichnet sich durch die harmonische Verschmelzung von Neoklassizismus und Barock aus."
        },
      },
      {
        icon: "palette",
        title: {
          pt: "Riqueza de Detalhes",
          en: "Richness of Details",
          de: "Detailreichtum"
        },
        description: {
          pt: "Colaboração constante com artistas e escultores como Alfred Adloff.",
          en: "Constant collaboration with artists and sculptors like Alfred Adloff.",
          de: "Ständige Zusammenarbeit mit Künstlern und Bildhauern wie Alfred Adloff."
        },
      },
      {
        icon: "domain",
        title: {
          pt: "Inovação Estrutural",
          en: "Structural Innovation",
          de: "Strukturelle Innovation"
        },
        description: {
          pt: "Pioneiro no uso de novas tecnologias construtivas para a época.",
          en: "Pioneer in the use of new construction technologies for the time.",
          de: "Pionier im Einsatz neuer Bautechnologien für die damalige Zeit."
        },
      },
    ],
    works: [
      {
        title: { pt: "Museu de Arte do RS", en: "RS Art Museum", de: "Kunstmuseum von RS" },
        image: {
          src: "/images/Margs.jpg",
          alt: "MARGS",
          caption: { pt: "Antiga Delegacia Fiscal", en: "Former Tax Office", de: "Ehemaliges Finanzamt" },
        },
      },
      {
        title: { pt: "Memorial do RS", en: "RS Memorial", de: "RS Gedenkstätte" },
        image: {
          src: "/images/Memorial RS.jpg",
          alt: "Memorial",
          caption: { pt: "Antigos Correios", en: "Former Post Office", de: "Ehemaliges Postamt" },
        },
      },
    ],
    ctaDescription: {
      pt: "A herança de Wiederspahn está espalhada pelo centro de Porto Alegre.",
      en: "Wiederspahn's heritage is spread throughout downtown Porto Alegre.",
      de: "Wiederspahns Erbe ist in der Innenstadt von Porto Alegre verteilt."
    },
    actions: {
      primary: {
        label: { pt: "Ver Biografia", en: "View Biography", de: "Biografie ansehen" },
        href: "/architects/theodor-wiederspahn",
      },
      secondary: {
        label: { pt: "Explorar Obras", en: "Explore Works", de: "Werke erkunden" },
      },
    },
  },
];