import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header";
import { axe } from "jest-axe";
import i18n from "@/features/i18n";

const mockI18n = {
  language: "pt",
  changeLanguage: vi.fn(),
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header - estrutura semântica", () => {
  it("deve renderizar uma estrutura semântica acessível", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /mapa|home/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /menu/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /português/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /deutsch/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /english/i,
      })
    ).toBeInTheDocument();
  });

  it("não deve possuir violações de acessibilidade", async () => {
  const { container } = render(<Header />);

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

  it("deve manter acessibilidade após abrir menu", async () => {
  const { container } = render(<Header />);

    fireEvent.click(
      screen.getByRole("button", {
      name:/menu/i
    })
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

it("mantem acessibilidade em outro idioma", async () => {
  mockI18n.language = "de";

  const { container } = render(<Header />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
});
