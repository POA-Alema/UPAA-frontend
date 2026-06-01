import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import HomePage from "./page";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import { architectsMock } from "@/features/architects/mocks/architect-mock";

vi.mock("@/features/architects/data/architects", () => ({
  getFeaturedArchitect: vi.fn(),
}));

vi.mock("@/components/layout/Header", () => ({
  default: () => <header role="banner">Header</header>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <footer role="contentinfo">Footer</footer>,
}));

vi.mock("@/features/home/components/landing-content", () => ({
  LandingContent: () => <div>LandingContent</div>,
}));

vi.mock("@/features/home/components/map-preview-section", () => ({
  MapPreviewSection: () => <section>MapPreview</section>,
}));

vi.mock("@/features/home/components/immigration-section-container", () => ({
  ImmigrationSection: () => <section>Immigration</section>,
}));

vi.mock(
  "@/features/architects/components/ArchitectPreview",
  () => ({
    ArchitectPreview: () => (
      <div data-testid="architect-preview">
        ArchitectPreview
      </div>
    ),
  })
);

const mockArchitect = architectsMock[0];

describe("HomePage", () => {

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getFeaturedArchitect)
      .mockResolvedValue(mockArchitect);
  });

  it("renderiza estrutura principal", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("banner")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("main")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("contentinfo")
    ).toBeInTheDocument();
  });

  it("busca arquiteto em destaque", async () => {
    render(await HomePage());

    expect(getFeaturedArchitect)
      .toHaveBeenCalledTimes(1);
  });

  it("renderiza architect preview quando houver arquiteto", async () => {
    vi.mocked(getFeaturedArchitect)
      .mockResolvedValue(mockArchitect);

    render(await HomePage());

    expect(
      screen.getByTestId("architect-preview")
    ).toBeInTheDocument();
  });

  it("não renderiza architect preview sem arquiteto", async () => {
    vi.mocked(getFeaturedArchitect)
      .mockResolvedValue(null);

    render(await HomePage());

    expect(
      screen.queryByTestId("architect-preview")
    ).not.toBeInTheDocument();
  });

  it("mantém acessibilidade com conteúdo", async () => {
    const { container } =
      render(await HomePage());

    expect(
      await axe(container)
    ).toHaveNoViolations();
  });

  it("mantém acessibilidade sem conteúdo", async () => {
    vi.mocked(getFeaturedArchitect)
      .mockResolvedValue(null);

    const { container } =
      render(await HomePage());

    expect(
      await axe(container)
    ).toHaveNoViolations();
  });

});