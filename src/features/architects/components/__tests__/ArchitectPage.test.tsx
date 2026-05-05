import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchitectPage } from "../ArchitectPage";
import { architectsMock } from "../../mocks/architect-mock";

describe("ArchitectPage", () => {
  const architect = architectsMock[0];

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
    expect(screen.getByRole("button", { name: /explorar obras/i })).toBeInTheDocument();
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
    expect(screen.queryByRole("heading", { level: 2, name: /características/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: /obras marcantes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /explorar obras/i })).not.toBeInTheDocument();
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
