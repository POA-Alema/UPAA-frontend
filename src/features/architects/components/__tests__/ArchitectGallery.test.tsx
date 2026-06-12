import { render, screen, within } from "@testing-library/react";
import type { ComponentPropsWithoutRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ArchitectGallery } from "../ArchitectGallery";
import type { ArchitectWork } from "../../types/architect";

const translations: Record<string, string> = {
  "image.expand": "Ampliar imagem",
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

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const works: ArchitectWork[] = [
  {
    title: "Museu de Arte do RS",
    href: "/buildings/margs",
    image: { src: "/margs.jpg", alt: "Fachada do MARGS" },
  },
  {
    title: "Memorial do RS",
    image: { src: "/memorial.jpg", alt: "Fachada do Memorial" },
  },
];

describe("ArchitectGallery", () => {
  it("não adiciona botão de ampliar em cards com href (mantém só o link)", () => {
    render(<ArchitectGallery items={works} />);

    const link = screen.getByRole("link", { name: /museu de arte do rs/i });
    expect(link).toHaveAttribute("href", "/buildings/margs");
    expect(
      within(link).queryByRole("button", { name: /ampliar imagem/i }),
    ).not.toBeInTheDocument();
  });

  it("adiciona o botão de ampliar em cards sem href", () => {
    render(<ArchitectGallery items={works} />);

    expect(
      screen.getByRole("button", { name: /ampliar imagem/i }),
    ).toBeInTheDocument();
  });
});
