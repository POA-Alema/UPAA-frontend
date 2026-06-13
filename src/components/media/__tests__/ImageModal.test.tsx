import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageModal } from "../ImageModal";
import type { ExpandableImageData } from "@/types/image";

const translations: Record<string, string> = {
  "image.close": "Fechar imagem ampliada",
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

const fullImage: ExpandableImageData = {
  src: "/margs.jpg",
  alt: "Fachada do MARGS",
  caption: "Fachada principal",
  title: "Museu de Arte",
  description: "Vista da fachada principal do museu.",
};

describe("ImageModal", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("fecha pelo botão de fechar", () => {
    const onClose = vi.fn();
    render(<ImageModal image={fullImage} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /fechar imagem ampliada/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha ao pressionar Esc", () => {
    const onClose = vi.fn();
    render(<ImageModal image={fullImage} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha ao clicar no backdrop", () => {
    const onClose = vi.fn();
    render(<ImageModal image={fullImage} onClose={onClose} />);

    const backdrop = screen
      .getByRole("dialog")
      .querySelector('[aria-hidden="true"]');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("bloqueia o scroll do body enquanto aberto", () => {
    render(<ImageModal image={fullImage} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("renderiza título e texto livre no painel lateral", () => {
    render(<ImageModal image={fullImage} onClose={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /museu de arte/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/vista da fachada principal/i)).toBeInTheDocument();
  });

  it("não renderiza painel lateral quando há apenas alt (só a imagem)", () => {
    render(
      <ImageModal image={{ src: "/x.jpg", alt: "Somente alt" }} onClose={vi.fn()} />,
    );

    expect(screen.getByRole("img", { name: /somente alt/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renderiza legenda sobreposta quando há apenas caption (sem texto livre)", () => {
    render(
      <ImageModal
        image={{ src: "/x.jpg", alt: "Imagem", caption: "Minha legenda" }}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Minha legenda")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
