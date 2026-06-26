"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import type { Feature, Polygon } from "geojson";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import { CENTRO_HISTORICO_GEOJSON } from "@/features/map/constants/centro-historico-boundary";
import type { MapMarker, Building } from "@/features/map/utils/map-buildings";
import { mapBuildingsToMarkers } from "@/features/map/utils/map-buildings";
import {
  trackMapBuildingsLoadFailure,
  trackMapBuildingsLoadSuccess,
  trackMapRecentralization,
} from "@/features/map/utils/map-analytics";
import {
  DEFAULT_MAP_CENTER,
  getRecentralizationStatus,
  type RecentralizationReason,
  type RecentralizationStatus,
} from "@/features/map/utils/location";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((m) => m.GeoJSON),
  { ssr: false },
);

const MapMarkers = dynamic(
  () => import("./map-markers").then((m) => m.MapMarkers),
  { ssr: false },
);

type MapPlaceholderProps = {
  className?: string;
  enableGeolocation?: boolean;
  showPopups?: boolean;
  showZoomControls?: boolean;
};

type AlertState = {
  message: string;
  reason: RecentralizationReason;
};

const DEFAULT_CENTER: [number, number] = [
  DEFAULT_MAP_CENTER.latitude,
  DEFAULT_MAP_CENTER.longitude,
];

export function MapPlaceholder({
  className = "h-125",
  enableGeolocation,
  showPopups = true,
  showZoomControls,
}: MapPlaceholderProps) {
  const { t, i18n } = useTranslation("common");
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const recenteredReasons = useRef<Set<RecentralizationReason>>(new Set());
  const shouldUseGeolocation = enableGeolocation ?? showPopups;

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(`/api/buildings?lang=${i18n.language}`);

        if (!response.ok) {
          throw new Error("Failed to load buildings");
        }

        const data: Building[] = await response.json();
        const mappedMarkers = mapBuildingsToMarkers(data);

        if (!isMounted) {
          return;
        }

        setMarkers(mappedMarkers);
        setHasError(false);
        trackMapBuildingsLoadSuccess({
          markerCount: mappedMarkers.length,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMarkers([]);
        setHasError(true);
        trackMapBuildingsLoadFailure({
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  const getAlertMessage = useCallback(
    (reason: RecentralizationReason) => {
      if (reason === "permission_denied") {
        return t(
          "map.alert_recentered_permission_denied",
          "Permissao de geolocalizacao negada. Exibindo o mapa centralizado no Centro Historico.",
        );
      }

      return t(
        "map.alert_geolocation_unavailable",
        "Geolocalizacao nao disponivel. Exibindo o mapa centralizado no Centro Historico.",
      );
    },
    [t],
  );

  const maybeRecenter = useCallback(
    (status: RecentralizationStatus) => {
      if (!status.shouldRecenter || !status.reason) {
        return;
      }

      setMapCenter(DEFAULT_CENTER);
      mapRef.current?.flyTo(DEFAULT_CENTER, 15, { duration: 1.2 });
      setAlertState({
        message: getAlertMessage(status.reason),
        reason: status.reason,
      });

      if (!recenteredReasons.current.has(status.reason)) {
        recenteredReasons.current.add(status.reason);
        trackMapRecentralization({ reason: status.reason });
      }
    },
    [getAlertMessage],
  );

  useEffect(() => {
    if (!shouldUseGeolocation) {
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      maybeRecenter({
        shouldRecenter: true,
        reason: "unavailable",
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setAlertState(null);
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        setUserPosition(null);
        maybeRecenter(getRecentralizationStatus(null, error));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [maybeRecenter, shouldUseGeolocation]);

  useEffect(() => {
    if (!alertState) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAlertState(null);
    }, 6000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [alertState]);

  return (
    <div className={`w-full relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={15}
        maxZoom={20}
        minZoom={15}
        ref={mapRef}
        zoomControl={
          typeof showZoomControls === "boolean" ? showZoomControls : showPopups
        }
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={15}
          maxZoom={20}
        />

        <GeoJSON
          data={CENTRO_HISTORICO_GEOJSON as unknown as Feature<Polygon>}
          style={{
            color: "#111111",
            weight: 6,
            opacity: 0.45,
            fillColor: "#ffd400",
            fillOpacity: 0.16,
          }}
        />

        <GeoJSON
          data={CENTRO_HISTORICO_GEOJSON as unknown as Feature<Polygon>}
          style={{
            color: "#ffd400",
            weight: 3,
            opacity: 1,
            dashArray: "10 6",
            fillOpacity: 0,
          }}
        />

        <MapMarkers
          markers={markers}
          showPopups={showPopups}
          userPosition={shouldUseGeolocation ? userPosition : null}
        />
      </MapContainer>

      {alertState ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-recenter-reason={alertState.reason ?? undefined}
          className="pointer-events-none absolute left-1/2 top-4 z-10000 w-[min(90vw,32rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-black/85 px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-sm"
        >
          {alertState.message}
        </div>
      ) : null}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-2 left-2 bg-white text-black px-3 py-1 rounded shadow"
        >
          {t("map.loading", "Carregando dados do mapa.")}
        </div>
      )}

      {!loading && markers.length === 0 && !hasError && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-2 left-2 bg-white text-black px-3 py-1 rounded shadow"
        >
          {t("map.empty", "Nenhum ponto disponivel para exibir.")}
        </div>
      )}

      {!loading && hasError && (
        <div
          role="alert"
          className="absolute top-2 left-2 bg-white text-black px-3 py-1 rounded shadow"
        >
          {t("map.load_error", "Nao foi possivel carregar os dados do mapa.")}
        </div>
      )}
    </div>
  );
}
