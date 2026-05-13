/* eslint-disable @next/next/no-img-element */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapMarkers } from "./map-markers";
import type { MapMarker } from "@/features/map/utils/map-buildings";

// 1. CORREÇÃO DO ERRO: Mock do react-i18next com suporte à inicialização
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

// Mock do seu arquivo de configuração local para evitar que ele tente inicializar o i18n real
vi.mock("@/features/i18n", () => ({
  default: {},
}));

// Mocks de infraestrutura (Next.js e Leaflet)
vi.mock("leaflet", () => ({
  default: {
    Icon: class Icon {
      constructor() {}
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src, fill, ...props }: any) => {
    void fill;
    return <img alt={alt} src={src} {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("react-leaflet", () => ({
  Marker: ({ children, eventHandlers, position }: any) => (
    <div
      data-testid={`marker-${position.join(",")}`}
      onClick={() => eventHandlers?.click?.()}
      role="button"
    >
      {children}
    </div>
  ),
  Tooltip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useMap: () => ({
    scrollWheelZoom: { disable: vi.fn(), enable: vi.fn() },
    dragging: { disable: vi.fn(), enable: vi.fn() },
  }),
}));

const marker: MapMarker = {
  id: 1,
  name: "MARGS",
  district: "Centro Histórico",
  summary: "Um museu histórico emblemático.",
  yearLabel: "1912",
  architectName: "Theodor Wiederspahn",
  routePath: "/buildings/margs",
  architectPath: "/architects/theodor-wiederspahn",
  attachments: [{ src: "/margs.jpg", alt: "Fachada", caption: "Fachada" }],
  position: [-30.02, -51.23],
};

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("MapMarkers", () => {
  beforeEach(() => {
    mockMatchMedia(false); // Simula Desktop
  });

  afterEach(() => {
    document.body.className = "";
    document.body.style.overflow = "";
    vi.useRealTimers();
  });

  it("renderiza a sidebar no desktop ao clicar em um marcador", () => {
    render(<MapMarkers markers={[marker]} />);

    const mapMarker = screen.getByTestId("marker--30.02,-51.23");
    fireEvent.click(mapMarker);

    // No seu código, a sidebar Desktop usa <aside>
    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeInTheDocument();
    expect(within(sidebar).getByRole("heading", { name: "MARGS", level: 1 })).toBeInTheDocument();
    expect(within(sidebar).getByText(/Ano:/i)).toBeInTheDocument();
    expect(within(sidebar).getByText("1912")).toBeInTheDocument();
  });

  it("abre a bottom sheet no mobile e bloqueia o scroll", () => {
    mockMatchMedia(true); // Simula Mobile

    render(<MapMarkers markers={[marker]} />);

    const mapMarker = screen.getByTestId("marker--30.02,-51.23");
    fireEvent.click(mapMarker);

    // O Portal do mobile usa role="dialog"
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body).toHaveClass("map-popup-sheet-open");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("exibe fallback de imagem quando não há anexos", () => {
    const markerEmpty = { ...marker, attachments: [] };
    render(<MapMarkers markers={[markerEmpty]} />);
    
    fireEvent.click(screen.getByTestId("marker--30.02,-51.23"));
    
    // Procura pelo texto definido no seu componente
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
  });

  it("fecha a sidebar após o delay da animação", async () => {
    vi.useFakeTimers();
    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.02,-51.23"));
    
    const closeButton = screen.getByLabelText(/Fechar detalhes da edificação/i);
    fireEvent.click(closeButton);

    // Simula a passagem do tempo do seu setTimeout (220ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});