import type { ImmigrationSection } from "../types/immigration";

export const immigrationMock: ImmigrationSection = {
  eyebrow: "Imigração Alemã no Rio Grande do Sul",
  title: "A Importância da Imigração Alemã para o Estado",
  content: `A imigração alemã no Rio Grande do Sul teve início em 1824, com a chegada de famílias vindas principalmente da Alemanha em busca de melhores condições de vida. Esses imigrantes foram instalados em colônias agrícolas e contribuíram muito para o desenvolvimento econômico e cultural do estado. Além da agricultura, trouxeram costumes, tradições, festas, arquitetura e a língua alemã, que influenciaram várias regiões gaúchas. Cidades como São Leopoldo, Novo Hamburgo e Gramado guardam até hoje marcas dessa herança. A imigração alemã foi muito importante para a formação da identidade cultural do Rio Grande do Sul.`,
  image: {
    src: "/images/oktoberfest.jpg",
    alt: "Fachada do Museu de Arte do Rio Grande do Sul, edificação histórica no centro de Porto Alegre",
  },
};

export const immigrationMockEmpty: ImmigrationSection = {
  eyebrow: "",
  title: "",
  content: "",
};
