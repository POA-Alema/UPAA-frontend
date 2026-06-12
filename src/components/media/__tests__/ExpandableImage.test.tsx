import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpandableImage } from "../ExpandableImage";
import type { ExpandableImageData } from "@/types/image";

const translations: Record<string, string> = {
  "image.expand": "Ampliar imagem",
  "image.close": "Fechar imagem ampliada",
  "image.source": "Fonte",
  "image.reference": "Referência",
  "image.credits": "Créditos",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) =>
      translations[key] ?? defaultValue ?? key,
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/features/i18n", () => ({ default: {} }));

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill,
    priority,
    ...props
  }: ComponentPropsWithoutRef<"img"> & { fill?: boolean; priority?: boolean }) => {
    void fill;
    void priority;
    void props;
    return <span role="img" aria-label={alt} />;
  },
}));

const image: ExpandableImageData = {
  src: "/margs.jpg",
  alt: "Fachada do MARGS",
  caption: "Fachada principal",
  description: "Vista da fachada principal.",
  source: "Acervo MARGS",
};

describe("ExpandableImage", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renderiza o botão de ampliar com o ícone open_in_full", () => {
    render(<ExpandableImage image={image} />);

    const expandButton = screen.getByRole("button", { name: /ampliar imagem/i });
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent("open_in_full");
  });

  it("não exibe o modal antes do clique", () => {
    render(<ExpandableImage image={image} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre o ImageModal ao clicar no botão de ampliar", () => {
    render(<ExpandableImage image={image} />);

    fireEvent.click(screen.getByRole("button", { name: /ampliar imagem/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /fechar imagem ampliada/i }),
    ).toBeInTheDocument();
  });

  it("fecha o modal ao acionar o botão de fechar", () => {
    render(<ExpandableImage image={image} />);

    fireEvent.click(screen.getByRole("button", { name: /ampliar imagem/i }));
    fireEvent.click(screen.getByRole("button", { name: /fechar imagem ampliada/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
