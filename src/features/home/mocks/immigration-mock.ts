import type { ImmigrationSection } from "../types/immigration";

export const immigrationMock: ImmigrationSection = {
  eyebrow: "Imigração Alemã no Rio Grande do Sul",
  content:
    "A imigração alemã no Rio Grande do Sul teve início em 1824...",
  image: {
    src: "/images/oktoberfest.jpg",
    alt: "Imagem da imigração alemã",
  },
};

export const immigrationMockEmpty: ImmigrationSection = {
  eyebrow: "",
  content: "",
};