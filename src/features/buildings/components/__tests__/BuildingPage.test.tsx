import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BuildingPage } from "../BuildingPage";
import { buildingsMock } from "../../mocks/building-mock";

describe("BuildingPage", () => {
  const building = buildingsMock[0];

  it("renders hero, eyebrow, technical specs, history, characteristics, gallery and CTAs", () => {
    render(<BuildingPage building={building} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /museu de arte do rio grande do sul/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/theodor wiederspahn, 1913/i)).toBeInTheDocument();
    expect(
      screen.getByText(/antiga delegacia fiscal da fazenda/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/localização/i)).toBeInTheDocument();
    expect(
      screen.getByText(/centro histórico de porto alegre/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/4\.800 m²/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /histórico/i })).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Pórtico do Cais Mauá")),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /características/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /simetria sutil/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /galeria de fotos/i })).toBeInTheDocument();
    expect(screen.getByAltText(/foto histórica externa/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /voltar ao mapa/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /conheça mais sobre o arquiteto/i })).toBeInTheDocument();
  });

  it("does not render optional sections when their data is empty", () => {
    render(
      <BuildingPage
        building={{
          ...building,
          technicalSpecs: [],
          characteristics: [],
          gallery: [],
          architectCta: undefined,
          actions: {},
        }}
      />,
    );

    expect(screen.queryByText(/localização/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: /características/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: /galeria de fotos/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /voltar ao mapa/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /conheça mais sobre o arquiteto/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /histórico/i })).toBeInTheDocument();
  });

  it("returns no markup when every renderable field is empty", () => {
    const { container } = render(
      <BuildingPage
        building={{
          ...building,
          title: "",
          eyebrow: "",
          subtitle: "",
          hero: undefined,
          history: "",
          technicalSpecs: [],
          characteristics: [],
          gallery: [],
          architectCta: undefined,
          actions: {},
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
