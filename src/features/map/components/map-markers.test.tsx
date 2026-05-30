import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapMarkers } from "./map-markers";
import type { MapMarker } from "@/features/map/utils/map-buildings";

const translations: Record<string, string> = {
  "map.close_details": "Fechar detalhes da edificação",
  "map.image_unavailable": "Imagem indisponível",
  "map.mapped_building": "Edificação",
  "map.year": "Ano",
  "map.author": "Arquiteto",
  "map.know_work": "Explorar Obra",
  "map.know_author": "Sobre o Autor",
  "map.open_route": "Abrir rota",
  "map.open_route_aria": "Abrir rota em aplicativo de navegação",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) =>
      translations[key] ?? defaultValue ?? key,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

vi.mock("@/features/i18n", () => ({
  default: {},
}));

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
  default: ({ alt, fill, priority, ...props }: ComponentPropsWithoutRef<"img"> & { fill?: boolean; priority?: boolean }) => {
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

interface MockMarkerProps {
  children?: ReactNode;
  eventHandlers?: { click?: () => void };
  position: [number, number];
}

vi.mock("react-leaflet", () => ({
  Marker: ({ children, eventHandlers, position }: MockMarkerProps) => (
    <div
      data-testid={`marker-${position.join(",")}`}
      onClick={() => eventHandlers?.click?.()}
      role="button"
      tabIndex={0}
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
    value: vi.fn().mockImplementation((query: string) => ({
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
    mockMatchMedia(false);
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

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeInTheDocument();
    
    expect(within(sidebar).getByRole("heading", { name: "MARGS", level: 1 })).toBeInTheDocument();
    
    expect(within(sidebar).getByText(/Ano:/i)).toBeInTheDocument();
    expect(within(sidebar).getByText("1912")).toBeInTheDocument();
  });

  it("abre a bottom sheet no mobile e bloqueia o scroll", () => {
    mockMatchMedia(true);

    render(<MapMarkers markers={[marker]} />);

    const mapMarker = screen.getByTestId("marker--30.02,-51.23");
    fireEvent.click(mapMarker);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body).toHaveClass("map-popup-sheet-open");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("exibe fallback de imagem quando não há anexos", () => {
    const markerEmpty = { ...marker, attachments: [] };
    render(<MapMarkers markers={[markerEmpty]} />);
    
    fireEvent.click(screen.getByTestId("marker--30.02,-51.23"));
    
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
  });

  it("fecha a sidebar após o delay da animação", async () => {
    vi.useFakeTimers();
    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.02,-51.23"));
    
    const closeButton = screen.getByLabelText(/Fechar detalhes da edificação/i);
    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});