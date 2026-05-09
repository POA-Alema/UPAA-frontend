import type { Building } from "../types/building";

export const buildingsMock: Building[] = [
  {
    id: "margs",
    slug: "margs",
    eyebrow: "Theodor Wiederspahn, 1913",
    title: "Museu de Arte do Rio Grande do Sul Ado Malagoli",
    subtitle: "Antiga Delegacia Fiscal da Fazenda no Estado do Rio Grande do Sul",
    summary:
      "Edifício projetado por Theodor Wiederspahn entre 1913 e 1914 para abrigar a antiga Delegacia Fiscal da Fazenda no Rio Grande do Sul, hoje sede do MARGS, na Praça da Alfândega.",
    hero: {
      src: "/images/margs/Margs.jpg",
      alt: "Fachada do Museu de Arte do Rio Grande do Sul",
    },
    history: `Localizado na Praça da Alfândega, o Museu de Arte do Rio Grande do Sul, pertencente ao estado, situa-se na área do antigo cais de 1856, aterrada quando da construção do novo porto, de onde se ingressa no centro histórico da cidade pelo Pórtico do Cais Mauá. Projetado e construído de 1913 a 1916, pelo arquiteto Theodor Wiederspahn, com a execução do Engenheiro Rudolph Arhons para abrigar a Delegacia Fiscal.

Seu projeto foi desenvolvido concomitantemente ao dos Correios e Telégrafos. Wiederspahn utilizou o conceito de simetria de forma sutil, na medida em que concebeu dois prédios assimétricos, mas de tal modo que cada qual possuísse uma torre junto à avenida que os separava. Dentro dos pressupostos dos mesmos conceitos do historicismo, o prédio dos Correios e Telégrafos foi revestido de uma linguagem abarrocada e a Delegacia Fiscal de outra, que tendia mais para o classicismo.`,
    technicalSpecs: [
      {
        label: "Localização",
        value: "Praça da Alfândega s/n. Centro Histórico de Porto Alegre",
      },
      { label: "Data", value: "1913 - 1914" },
      { label: "Projeto", value: "Arquiteto Theodor Wiederspahn" },
      { label: "Construção", value: "Engenheiro Rudolph Arhons" },
      {
        label: "Ornamentos e Esculturas",
        value:
          "Oficinas de João Vicente Friederichs, com figuras da fachada de Alfred Adloff",
      },
      { label: "Área Construída", value: "4.800 m² (aproximadamente)" },
      { label: "Ocupação Atual", value: "Sede do MARGS desde 1978" },
      {
        label: "Projeto de Restauração",
        value: "Ediolanda Liedke (1996–1998) e Urbana Logística Ambiental (2015)",
      },
      {
        label: "Tombamento",
        value: "1985 (Governo do Estado do RS) e 2000 (IPHAN)",
      },
    ],
    characteristics: [
      {
        icon: "balance",
        title: "Simetria Sutil",
        description:
          "Concebido em conjunto com o prédio dos Correios e Telégrafos, forma uma dupla assimétrica unida por torres dispostas junto à avenida que separa as duas edificações.",
      },
      {
        icon: "account_balance",
        title: "Linguagem Classicista",
        description:
          "Enquanto o prédio dos Correios recebeu uma estética abarrocada, a antiga Delegacia Fiscal foi revestida de uma linguagem voltada ao classicismo, dentro dos preceitos do historicismo da época.",
      },
      {
        icon: "texture",
        title: "Esculturas de Fachada",
        description:
          "Trabalho ornamental executado pelas oficinas de João Vicente Friederichs, com as figuras da fachada de autoria de Alfred Adloff.",
      },
    ],
    gallery: [
      {
        src: "/images/margs/planta_baixa.jpg",
        alt: "Planta baixa do segundo pavimento da antiga Delegacia Fiscal",
        caption: "Planta baixa",
      },
      {
        src: "/images/margs/fachadas.jpg",
        alt: "Fachada principal da antiga Delegacia Fiscal",
        caption: "Fachadas",
      },
      {
        src: "/images/margs/fotos_externas.jpg",
        alt: "Foto histórica externa do MARGS",
        caption: "Fotos externas",
      },
      {
        src: "/images/margs/fotos_internas.jpg",
        alt: "Vista interna do hall central do MARGS",
        caption: "Fotos internas",
      },
      {
        src: "/images/margs/planta_baixa.jpg",
        alt: "Planta baixa do segundo pavimento da antiga Delegacia Fiscal",
        caption: "Planta baixa (2)",
      },
      {
        src: "/images/margs/fachadas.jpg",
        alt: "Fachada principal da antiga Delegacia Fiscal",
        caption: "Fachadas (2)",
      },
      {
        src: "/images/margs/fotos_externas.jpg",
        alt: "Foto histórica externa do MARGS",
        caption: "Fotos externas (2)",
      },
      {
        src: "/images/margs/fotos_internas.jpg",
        alt: "Vista interna do hall central do MARGS",
        caption: "Fotos internas (2)",
      },
    ],
    architectCta: {
      description:
        "Explore a vida e o legado de Theodor Wiederspahn, o arquiteto que moldou a paisagem urbana de Porto Alegre com suas obras monumentais.",
      label: "Conheça mais sobre o Arquiteto",
      href: "/architects/theodor-wiederspahn",
    },
    actions: {
      backToMap: {
        label: "Voltar ao Mapa",
        href: "/mapa",
      },
    },
  },
  {
    id: "casa-de-cultura-mario-quintana",
    slug: "casa-de-cultura-mario-quintana",
    eyebrow: "Theodor Wiederspahn, 1916-1933",
    title: "Casa de Cultura Mario Quintana",
    subtitle: "(Antigo Hotel Majestic)",
    summary:
      "Antigo Hotel Majestic, hoje um dos principais polos culturais de Porto Alegre, inaugurado como centro cultural em 1990 após restauração do prédio histórico erguido entre 1916 e 1933.",
    hero: {
      src: "/images/cdcMarioQuintana.jpg",
      alt: "Fachada da Casa de Cultura Mario Quintana",
    },
    history: `Erguido entre 1916 e 1933 para abrigar o Hotel Majestic, o edifício foi durante décadas o ponto de encontro da elite intelectual e política de Porto Alegre. Sua imponência classicista e o requinte dos ambientes internos refletiam o prestígio que a cidade conquistava no início do século XX como capital econômica do Rio Grande do Sul.

Após anos de decadência e ameaça de demolição, o prédio foi tombado e restaurado, dando lugar em 1990 à Casa de Cultura Mario Quintana, em homenagem ao poeta gaúcho que ali residiu durante anos. Hoje o espaço reúne teatros, cinemas, bibliotecas, galerias e ateliês, mantendo viva a memória arquitetônica e literária do estado.`,
    technicalSpecs: [
      { label: "Localização", value: "Rua dos Andradas, 736. Centro Histórico" },
      { label: "Data", value: "1916 - 1933" },
      { label: "Projeto", value: "Arquiteto Theo Wiederspahn" },
      { label: "Função Original", value: "Hotel Majestic" },
      { label: "Reabertura", value: "1990 como Casa de Cultura" },
      { label: "Homenageado", value: "Poeta Mário Quintana" },
      { label: "Tombamento", value: "Patrimônio Histórico Estadual" },
    ],
    characteristics: [
      {
        icon: "apartment",
        title: "Volumetria Eclética",
        description:
          "A composição de fachada reúne elementos do classicismo e do art déco, traduzindo a transição estilística vivida pela arquitetura porto-alegrense entre o início e a metade do século XX.",
      },
      {
        icon: "menu_book",
        title: "Memória Literária",
        description:
          "O quarto 217, ocupado por Mário Quintana, foi preservado e transformado em museu, integrando a arquitetura ao legado literário do poeta gaúcho.",
      },
      {
        icon: "theaters",
        title: "Espaços Culturais",
        description:
          "A restauração reorganizou os pavimentos para abrigar teatros, salas de cinema, bibliotecas e galerias, criando um circuito cultural verticalizado raro no centro histórico.",
      },
    ],
    gallery: [
      {
        src: "/images/cdcMarioQuintana.jpg",
        alt: "Fachada principal da CCMQ",
        caption: "Fachada principal",
      },
      {
        src: "/images/cdcMarioQuintana_2.jpg",
        alt: "Detalhe arquitetônico interno da CCMQ",
        caption: "Detalhe interno",
      },
    ],
    architectCta: {
      description:
        "Explore a vida e o legado de Theodor Wiederspahn, o arquiteto que moldou a paisagem urbana de Porto Alegre com suas obras monumentais.",
      label: "Conheça mais sobre o Arquiteto",
      href: "/architects/theodor-wiederspahn",
    },
    actions: {
      backToMap: {
        label: "Voltar ao Mapa",
        href: "/mapa",
      },
    },
  },
];
