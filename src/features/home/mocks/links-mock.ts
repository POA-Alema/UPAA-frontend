import type { LinksSection } from "../types/links";

type LinksLanguage = "pt" | "en" | "de";

export const linksMockByLanguage: Record<LinksLanguage, LinksSection> = {
  pt: {
    title: "Parceiros Institucionais",
    items: [
      {
        id: "link-delfos",
        label: "DELFOS",
        href: "https://www.pucrs.br/delfos/",
        description: "Espaco de documentacao e memoria cultural da PUCRS",
      },
      {
        id: "link-ages",
        label: "AGES",
        href: "https://www.ages.pucrs.br/",
        description: "Agencia experimental da Escola Politecnica da PUCRS",
      },
    ],
  },
  en: {
    title: "Institutional Partners",
    items: [
      {
        id: "link-delfos",
        label: "DELFOS",
        href: "https://www.pucrs.br/delfos/",
        description: "PUCRS documentation and cultural memory center",
      },
      {
        id: "link-ages",
        label: "AGES",
        href: "https://www.ages.pucrs.br/",
        description: "Experimental agency of the PUCRS Polytechnic School",
      },
    ],
  },
  de: {
    title: "Institutionelle Partner",
    items: [
      {
        id: "link-delfos",
        label: "DELFOS",
        href: "https://www.pucrs.br/delfos/",
        description: "Dokumentations- und Kulturgedachtniszentrum der PUCRS",
      },
      {
        id: "link-ages",
        label: "AGES",
        href: "https://www.ages.pucrs.br/",
        description: "Experimentelle Agentur der Polytechnischen Schule der PUCRS",
      },
    ],
  },
};

export function getLinksMock(lang = "pt"): LinksSection {
  const language = lang === "en" || lang === "de" ? lang : "pt";
  return linksMockByLanguage[language];
}

export const linksMock: LinksSection = getLinksMock("pt");

export const linksMockEmpty: LinksSection = {
  title: "",
  items: [],
};
