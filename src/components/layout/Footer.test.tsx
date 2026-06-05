import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Footer from "./Footer";

const mockI18n = {
  language: "pt",
  changeLanguage: vi.fn(),
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

describe("Footer - acessibilidade", () => {
  beforeEach(() => {
    mockI18n.language = "pt";
  });

  it("deve renderizar uma estrutura semântica acessível", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    expect(
      screen.getByRole("navigation")
    ).toBeInTheDocument();

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });
  });

  it("não deve possuir violações de acessibilidade", async () => {
    const { container } = render(<Footer />);

    expect(await axe(container))
      .toHaveNoViolations();
  });

  it("mantém acessibilidade em outro idioma", async () => {
    mockI18n.language = "de";

    const { container } = render(<Footer />);

    expect(await axe(container))
      .toHaveNoViolations();
  });
});