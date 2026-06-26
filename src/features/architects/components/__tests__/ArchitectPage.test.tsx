import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchitectPage } from "../ArchitectPage";
import type { Architect } from "../../types/architect";

const architect: Architect = {
  id: "theodor-wiederspahn",
  slug: "theodor-wiederspahn",
  eyebrow: "Arquiteto",
  title: "Theodor Wiederspahn",
  bioSummary: "Resumo vindo do backend.",
  bio: "<p>Theodor Alexander conhecido como Theo Wiederspahn marcou a paisagem urbana de Porto Alegre.</p>",
  image: {
    src: "/images/architects/theodor.jpg",
    alt: "Theodor Wiederspahn",
    caption: "Um dos maiores nomes da arquitetura gaúcha",
  },
  actions: {
    secondary: {
      label: "Explorar obras",
      href: "/mapa",
    },
  },
  works: [
    {
      title: "MARGS",
      image: {
        src: "/images/margs.jpg",
        alt: "MARGS",
      },
      href: "/buildings/margs",
    },
  ],
  ctaDescription: "Conheca as obras mapeadas do arquiteto.",
};

describe("ArchitectPage", () => {
  it("renders title, bio, image, caption and action content", () => {
    render(<ArchitectPage architect={architect} backToMapHref="/mapa" />);

    expect(screen.getByRole("heading", { level: 1, name: /theodor wiederspahn/i })).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("heodor Alexander conhecido como Theo Wiederspahn")
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText(/theodor wiederspahn/i)).toBeInTheDocument();
    expect(screen.getByText(/um dos maiores nomes da arquitetura gaúcha/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao mapa/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao mapa/i })).toHaveAttribute(
      "href",
      "/mapa",
    );
    expect(screen.getByRole("link", { name: /explorar obras/i })).toBeInTheDocument();
  });

  it("does not render optional sections when their data is empty", () => {
    render(
      <ArchitectPage
        architect={{
          ...architect,
          details: [],
          characteristics: [],
          works: [],
          ctaDescription: "",
          actions: {},
          image: {
            ...architect.image!,
            caption: "",
          },
        }}
        backToMapHref="/mapa"
      />
    );

    expect(screen.queryByRole("heading", { level: 2, name: /história/i })).toBeInTheDocument();
    expect(screen.queryByText(/um dos maiores nomes da arquitetura gaúcha/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: /obras marcantes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /explorar obras/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: /características/i })).toBeInTheDocument();
  });

  it("returns no markup when every renderable field is empty", () => {
    const { container } = render(
      <ArchitectPage
        architect={{
          ...architect,
          title: "",
          eyebrow: "",
          bio: "",
          image: undefined,
          details: [],
          characteristics: [],
          works: [],
          ctaDescription: "",
          actions: {},
        }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
