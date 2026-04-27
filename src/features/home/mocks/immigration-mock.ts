import type { ImmigrationSection } from "../types/immigration";

export const immigrationMock: ImmigrationSection = {
  eyebrow: "IMIGRAÇÃO ALEMÃ NO RIO GRANDE DO SUL",
  title: "A IMPORTÂNCIA DA IMIGRAÇÃO ALEMÃ PARA O ESTADO",
  content: `A imigração alemã no Rio Grande do Sul teve início em 1824, com a chegada de famílias vindas principalmente da Alemanha em busca de melhores condições de vida. Esses imigrantes foram instalados em colônias agrícolas e contribuíram muito para o desenvolvimento econômico e cultural do estado. Além da agricultura, trouxeram costumes, tradições, festas, arquitetura e a língua alemã, que influenciaram várias regiões gaúchas. Cidades como São Leopoldo, Novo Hamburgo e Gramado guardam até hoje marcas dessa herança. A imigração alemã foi muito importante para a formação da identidade cultural do Rio Grande do Sul.`,
  image: {
    src: "/images/Margs.jpg",
    alt: "Celebração da imigração alemã no Rio Grande do Sul com pessoas em trajes típicos alemães e bandeira alemã",
  },
};

export const immigrationMockEmpty: ImmigrationSection = {
  eyebrow: "",
  title: "",
  content: "",
};

export const mockImmigrationSection: ImmigrationSection = {
  eyebrow: "Imigração Alemã no Rio Grande do Sul",
  title: "A Importância da Imigração Alemã para o Estado",
  content: `A imigração alemã no Rio Grande do Sul teve início em 1824, com a chegada de famílias vindas principalmente da Alemanha em busca de melhores condições de vida. Esses imigrantes foram instalados em colônias agrícolas e contribuíram muito para o desenvolvimento econômico e cultural do estado. Além da agricultura, trouxeram costumes, tradições, festas, arquitetura e a língua alemã, que influenciaram várias regiões gaúchas. Cidades como São Leopoldo, Novo Hamburgo e Gramado guardam até hoje marcas dessa herança. A imigração alemã foi muito importante para a formação da identidade cultural do Rio Grande do Sul.`,
  image: {
    src: "/images/german-immigration.jpg",
    alt: "Dança tradicional alemã em frente à catedral",
  },
};

