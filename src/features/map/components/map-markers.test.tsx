/* eslint-disable @next/next/no-img-element */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapMarkers } from "./map-markers";
import type { MapMarker } from "@/features/map/utils/map-buildings";

vi.mock("leaflet", () => ({
  default: {
    Icon: class Icon {
      constructor(public options: unknown) {}
    },
  },
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    fill,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    src: string;
  }) => {
    void fill;

    return <img alt={alt} src={src} {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("react-leaflet", () => ({
  Marker: ({
    children,
    eventHandlers,
    position,
  }: {
    children: ReactNode;
    eventHandlers?: { click?: () => void };
    position: [number, number];
  }) => (
    <div
      data-position={position.join(",")}
      data-testid={`marker-${position.join(",")}`}
      onClick={() => eventHandlers?.click?.()}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),
  Popup: ({ children }: { children: ReactNode }) => (
    <div data-testid="leaflet-popup">{children}</div>
  ),
}));

const marker: MapMarker = {
  id: 1,
  name: "Museu de Arte do Rio Grande do Sul (MARGS)",
  district: "Centro Historico",
  summary:
    "Um dos marcos culturais mais emblematicos do centro historico, com presenca monumental e memoria urbana duradoura.",
  yearLabel: "1912",
  architectName: "Theodor Wiederspahn",
  routePath: "/buildings/margs",
  architectPath: "/architects/theodor-wiederspahn",
  attachments: [
    {
      src: "/images/margs-1.jpg",
      alt: "Fachada principal do MARGS",
      caption: "Fachada principal",
    },
    {
      src: "/images/margs-2.jpg",
      alt: "Vista lateral do MARGS",
      caption: "Vista lateral",
    },
  ],
  position: [-30.029111, -51.231694],
};

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: "(max-width: 820px)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("MapMarkers", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    document.body.className = "";
    document.body.style.overflow = "";
    vi.useRealTimers();
  });

  it("renderiza o popup desktop com metadados e CTA do autor", () => {
    render(<MapMarkers markers={[marker]} />);

    const popup = screen.getByTestId("leaflet-popup");

    expect(popup).toBeInTheDocument();
    expect(within(popup).getByText(/^Centro Historico$/i)).toBeInTheDocument();
    expect(
      within(popup).getByRole("heading", { name: /margs/i }),
    ).toBeInTheDocument();
    expect(within(popup).getByText("Ano: 1912")).toBeInTheDocument();
    expect(
      within(popup).getByText("Autoria: Theodor Wiederspahn"),
    ).toBeInTheDocument();
    expect(
      within(popup).getByRole("link", { name: /conhecer o autor/i }),
    ).toHaveAttribute("href", "/architects/theodor-wiederspahn");
    expect(
      within(popup).getByText("Imagem: Fachada principal"),
    ).toBeInTheDocument();
  });

  it("atualiza a imagem selecionada ao clicar em um thumbnail", () => {
    render(<MapMarkers markers={[marker]} />);

    const secondThumb = screen.getByTitle("Vista lateral");
    fireEvent.click(secondThumb);

    expect(screen.getByText("Imagem: Vista lateral")).toBeInTheDocument();
    expect(screen.getAllByAltText("Vista lateral do MARGS")).toHaveLength(2);
  });

  it("abre um bottom sheet no mobile e bloqueia o scroll do body", () => {
    mockMatchMedia(true);

    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body).toHaveClass("map-popup-sheet-open");
    expect(document.body.style.overflow).toBe("hidden");
    expect(
      screen.getAllByRole("button", {
        name: /fechar detalhes da edificacao/i,
      }),
    ).toHaveLength(2);
  });

  it("fecha o bottom sheet no mobile e restaura o body apos a animacao", () => {
    vi.useFakeTimers();
    mockMatchMedia(true);

    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    const dialog = screen.getByRole("dialog");
    const closeButtons = within(dialog).getAllByRole("button", {
      name: /fechar detalhes da edificacao/i,
    });

    fireEvent.click(closeButtons[0]);

    expect(dialog.className).toContain("map-popup-sheet--closing");

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("map-popup-sheet-open");
    expect(document.body.style.overflow).toBe("");
  });

  it("nao exibe popup nem sheet quando showPopups for falso", () => {
    mockMatchMedia(true);

    render(<MapMarkers markers={[marker]} showPopups={false} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    expect(screen.queryByTestId("leaflet-popup")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
