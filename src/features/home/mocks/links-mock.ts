import type { LinksSection } from "../types/links";

export const linksMock: LinksSection = {
  title: "Links úteis",
  items: [
    {
      id: "link-margs",
      label: "MARGS",
      href: "https://www.margs.rs.gov.br/",
      description: "Museu de Arte do Rio Grande do Sul",
    },
    {
      id: "link-memorial",
      label: "Memorial do RS",
      href: "https://www.memorial.rs.gov.br/",
      description: "Instituição cultural do estado",
    },
  ],
};

export const linksMockEmpty: LinksSection = {
  title: "",
  items: [],
};