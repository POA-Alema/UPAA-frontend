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

// 1. I18N MOCK
vi.mock("@/features/i18n", () => ({ default: {} }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

// 2. MOCK DO NEXT/NAVIGATION
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("leaflet", () => ({
  default: {
    Icon: class Icon {
      constructor(public options: unknown) {}
    },
  },
}));

// FIX: Strip 'priority' to avoid the console warning
vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    fill,
    priority, 
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    src: string;
  }) => {
    void fill;
    void priority;
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

// 3. MOCKS DO REACT-LEAFLET
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
      data-testid={`marker-${position.join(",")}`}
      onClick={() => eventHandlers?.click?.()}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),
  Tooltip: ({ children }: { children: ReactNode }) => (
    <div data-testid="leaflet-tooltip">{children}</div>
  ),
  useMap: () => ({
    scrollWheelZoom: { disable: vi.fn(), enable: vi.fn() },
    dragging: { disable: vi.fn(), enable: vi.fn() },
  }),
}));

const marker: MapMarker = {
  id: 1,
  name: "Museu de Arte do Rio Grande do Sul (MARGS)",
  district: "Centro Historico",
  summary: "Um dos marcos culturais mais emblematicos.",
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
    vi.clearAllMocks();
    vi.useRealTimers();
  });

 it("renders the desktop sidebar after clicking a marker", () => {
  render(<MapMarkers markers={[marker]} />);

  fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

  const sidebar = screen.getByRole("complementary");

  expect(sidebar).toBeInTheDocument();

  expect(
    within(sidebar).getAllByText(
      /Museu de Arte do Rio Grande do Sul/i
    )[0]
  ).toBeInTheDocument();

  expect(
    within(sidebar).getByText(/1912/i)
  ).toBeInTheDocument();
});

  it("shows the building name in a tooltip when selected", () => {
    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    const tooltip = screen.getByTestId("leaflet-tooltip");
    expect(tooltip).toHaveTextContent(marker.name);
  });

  it("displays the image fallback when the building has no photos", () => {
    const markerWithoutPhotos = { ...marker, attachments: [] };
    render(<MapMarkers markers={[markerWithoutPhotos]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));
    
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
  });

  it("opens a bottom sheet on mobile via Portal", () => {
    mockMatchMedia(true);
    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    // FIX: aside defaults to complementary, not dialog
    const dialog = screen.getByRole("complementary");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(marker.name)).toBeInTheDocument();
  });

  it("closes the sidebar on desktop when clicking close button", async () => {
    vi.useFakeTimers();
    render(<MapMarkers markers={[marker]} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));
    
    // FIX: The button name is "close" due to the Material Icon text
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(600); // Increased time slightly for safety
    });

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("does not render sidebar or sheet when showPopups is false", () => {
    render(<MapMarkers markers={[marker]} showPopups={false} />);

    fireEvent.click(screen.getByTestId("marker--30.029111,-51.231694"));

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});