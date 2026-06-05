import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MapPlaceholder } from "./map-placeholder";
import { DEFAULT_MAP_CENTER } from "@/features/map/utils/location";
import { trackMapRecentralization } from "@/features/map/utils/map-analytics";

const flyToMock = vi.fn();
const clearWatchMock = vi.fn();
const translateMock = (_key: string, defaultValue: string) => defaultValue;
let watchPositionMock: ReturnType<typeof vi.fn>;

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: translateMock,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

vi.mock("@/features/i18n", () => ({
  default: {},
}));

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
    const loaderText = loader.toString();

    if (loaderText.includes("MapContainer")) {
      function MockMapContainer({
        children,
      }: {
        children?: ReactNode;
        center?: [number, number];
      }) {
        return <div data-testid="map-container">{children}</div>;
      }

      return MockMapContainer;
    }

    if (loaderText.includes("TileLayer")) {
      function MockTileLayer() {
        return <div data-testid="tile-layer" />;
      }

      return MockTileLayer;
    }

    if (loaderText.includes("map-recenter-controller")) {
      function MockMapRecenterController({
        onMapReady,
        onOutsideLimit,
      }: {
        onMapReady?: (map: { flyTo: typeof flyToMock }) => void;
        onOutsideLimit?: () => void;
      }) {
        useEffect(() => {
          onMapReady?.({ flyTo: flyToMock });
        }, [onMapReady]);

        return (
          <button data-testid="recenter-controller" onClick={onOutsideLimit}>
            recenter
          </button>
        );
      }

      return MockMapRecenterController;
    }

    function MockMapMarkers({
      userPosition,
    }: {
      userPosition?: [number, number] | null;
    }) {
      return (
        <div data-testid="map-markers">
          {userPosition ? userPosition.join(",") : "no-user-position"}
        </div>
      );
    }

    return MockMapMarkers;
  },
}));

vi.mock("leaflet", () => ({
  default: {},
}));

vi.mock("@/features/map/utils/map-analytics", () => ({
  trackMapBuildingsLoadFailure: vi.fn(),
  trackMapBuildingsLoadSuccess: vi.fn(),
  trackMapRecentralization: vi.fn(),
}));

function geolocationPosition(
  latitude: number,
  longitude: number,
): GeolocationPosition {
  return {
    coords: {
      latitude,
      longitude,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  } as GeolocationPosition;
}

function geolocationError(code: number): GeolocationPositionError {
  return {
    code,
    message: "Geolocation error",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  } as GeolocationPositionError;
}

function mockGeolocation(
  position: GeolocationPosition | null,
  positionError?: GeolocationPositionError,
) {
  watchPositionMock = vi.fn((success, error) => {
    if (position) {
      success(position);
    } else if (positionError && error) {
      error(positionError);
    }

    return 1;
  });

  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      watchPosition: watchPositionMock,
      clearWatch: clearWatchMock,
    },
  });
}

describe("MapPlaceholder geolocation recentering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: vi.fn().mockResolvedValue([]),
      }),
    );
    flyToMock.mockClear();
    clearWatchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("keeps the user position when it is inside the distance limit", async () => {
    mockGeolocation(
      geolocationPosition(
        DEFAULT_MAP_CENTER.latitude + 0.001,
        DEFAULT_MAP_CENTER.longitude + 0.001,
      ),
    );

    render(<MapPlaceholder />);

    await waitFor(() => {
      expect(screen.getByTestId("map-markers")).toHaveTextContent(
        `${DEFAULT_MAP_CENTER.latitude + 0.001},${DEFAULT_MAP_CENTER.longitude + 0.001}`,
      );
    });

    expect(screen.queryByText(/Recentralizando/i)).not.toBeInTheDocument();
    expect(trackMapRecentralization).not.toHaveBeenCalled();
  });

  it("recenters and shows an accessible alert when the user is outside the limit", async () => {
    mockGeolocation(
      geolocationPosition(
        DEFAULT_MAP_CENTER.latitude + 0.05,
        DEFAULT_MAP_CENTER.longitude + 0.05,
      ),
    );

    render(<MapPlaceholder />);

    expect(
      await screen.findByText(/fora da.*mapa/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Recentralizando.*Centro/i)).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.getByTestId("map-markers")).toHaveTextContent(
      "no-user-position",
    );
    expect(trackMapRecentralization).toHaveBeenCalledWith({
      reason: "outside_limit",
    });
  });

  it("recenters and explains when geolocation permission is denied", async () => {
    mockGeolocation(null, geolocationError(1));

    render(<MapPlaceholder />);

    expect(
      await screen.findByText(/Permissao de geolocalizacao negada/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Centro Historico/i)).toHaveAttribute(
      "data-recenter-reason",
      "permission_denied",
    );
    expect(trackMapRecentralization).toHaveBeenCalledWith({
      reason: "permission_denied",
    });
  });

  it("does not run geolocation alerts when geolocation is disabled", async () => {
    mockGeolocation(
      geolocationPosition(
        DEFAULT_MAP_CENTER.latitude + 0.05,
        DEFAULT_MAP_CENTER.longitude + 0.05,
      ),
    );

    render(<MapPlaceholder showPopups={false} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/buildings");
    });

    expect(watchPositionMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/Recentralizando/i)).not.toBeInTheDocument();
  });

  it("recenters when the map viewport moves outside the useful area", async () => {
    mockGeolocation(
      geolocationPosition(
        DEFAULT_MAP_CENTER.latitude + 0.001,
        DEFAULT_MAP_CENTER.longitude + 0.001,
      ),
    );

    render(<MapPlaceholder />);

    fireEvent.click(await screen.findByTestId("recenter-controller"));

    expect(await screen.findByText(/fora da.*mapa/i)).toBeInTheDocument();
    expect(flyToMock).toHaveBeenCalled();
    expect(trackMapRecentralization).toHaveBeenCalledWith({
      reason: "outside_limit",
    });
  });
});
