"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import "@/features/i18n";
import type { MapMarker, Building } from "@/features/map/utils/map-buildings";
import { mapBuildingsToMarkers } from "@/features/map/utils/map-buildings";
import {
  DEFAULT_MAP_CENTER,
  DISTANCE_LIMIT_METERS,
  getRecentralizationStatus,
  RecentralizationReason,
} from "@/features/map/utils/location";
import type { Map as LeafletMap } from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);

const MapMarkers = dynamic(
  () => import("./map-markers").then((m) => m.MapMarkers),
  { ssr: false },
);

type MapPlaceholderProps = {
  className?: string;
  showPopups?: boolean;
  showZoomControls?: boolean;
};

type AlertState = {
  message: string;
  reason: RecentralizationReason;
};

function recordMapEvent(reason: RecentralizationReason) {
  if (!reason) {
    return;
  }

  const payload = {
    event: "map_action",
    action: "recenter",
    reason,
  };

  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push(payload);
    return;
  }

  if (typeof window !== "undefined") {
    console.log("Map analytics event:", payload);
  }
}

export function MapPlaceholder({
  className = "h-125",
  showPopups = true,
  showZoomControls,
}: MapPlaceholderProps) {
  const { t } = useTranslation("common");
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    DEFAULT_MAP_CENTER.latitude,
    DEFAULT_MAP_CENTER.longitude,
  ]);
  const mapRef = useRef<LeafletMap | null>(null);
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null);
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch("/api/buildings");

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
      } catch {
        if (!isMounted) {
          return;
        }

        setMarkers([]);
        setHasError(true);
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
  }, []);

  useEffect(() => {
    const maybeRecenter = (
      status: ReturnType<typeof getRecentralizationStatus>,
    ) => {
      if (!status.shouldRecenter) {
        return;
      }

      const center: [number, number] = [
        DEFAULT_MAP_CENTER.latitude,
        DEFAULT_MAP_CENTER.longitude,
      ];

      setMapCenter(center);
      setAlertState({
        message:
          status.reason === "permission_denied"
            ? t(
                "map.alert_recentered_permission_denied",
                "Permissão de geolocalização negada. Exibindo o mapa centralizado no Centro Histórico.",
              )
            : status.reason === "outside_limit"
            ? t(
                "map.alert_recentered_outside_limit",
                "Você está fora da área útil do mapa. Recentralizando no Centro Histórico.",
              )
            : t(
                "map.alert_geolocation_unavailable",
                "Geolocalização não disponível. Exibindo o mapa centralizado no Centro Histórico.",
              ),
        reason: status.reason,
      });

      if (leafletMap) {
        leafletMap.flyTo(center, 15, { duration: 1.2 });
      }

      recordMapEvent(status.reason);
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      maybeRecenter({
        shouldRecenter: true,
        reason: "unavailable",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        maybeRecenter(getRecentralizationStatus(position, null));
      },
      (error) => {
        maybeRecenter(getRecentralizationStatus(null, error));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [leafletMap, t]);

  return (
    <div className={`w-full relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={15}
        maxZoom={20}
        minZoom={15}
        ref={mapRef}
        whenReady={() => {
          if (mapRef.current) {
            setLeafletMap(mapRef.current);
          }
        }}
        zoomControl={typeof showZoomControls === "boolean" ? showZoomControls : showPopups}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={15}
          maxZoom={20}
        />

        <MapMarkers markers={markers} showPopups={showPopups} />
      </MapContainer>

      {alertState ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed left-1/2 top-4 z-50 w-[min(90vw,32rem)] -translate-x-1/2 rounded-2xl border border-black/10 bg-black/85 px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-sm"
        >
          {alertState.message}
        </div>
      ) : null}

      {!loading && markers.length === 0 && !hasError && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow">
          {t("map.no_markers_message", "Nenhum ponto disponivel para exibir.")}
        </div>
      )}

      {!loading && hasError && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow">
          {t(
            "map.load_error_message",
            "Nao foi possivel carregar os dados do mapa.",
          )}
        </div>
      )}
    </div>
  );
}
