"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LeafletEventHandlerFnMap, Map as LeafletMap } from "leaflet";
import type { Feature, Polygon } from "geojson";
import type { MapMarker, Building } from "@/features/map/utils/map-buildings";
import { mapBuildingsToMarkers } from "@/features/map/utils/map-buildings";
import {
  CENTRO_HISTORICO_GEOJSON,
  CENTRO_HISTORICO_VIEW_BOUNDS,
} from "@/features/map/constants/centro-historico-boundary";

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
  showPopups?: boolean;
};

const INITIAL_CENTER: [number, number] = [-30.0277, -51.2287];

function isPointInsidePolygon(lng: number, lat: number, polygon: readonly [number, number][]) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function MapPlaceholder({
  className = "h-125",
  showPopups = true,
}: MapPlaceholderProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const lastValidCenterRef = useRef<{ lat: number; lng: number }>({
    lat: INITIAL_CENTER[0],
    lng: INITIAL_CENTER[1],
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const polygon = CENTRO_HISTORICO_GEOJSON.geometry.coordinates[0];

  const mapEvents: LeafletEventHandlerFnMap = {
    moveend: () => {
      const map = mapRef.current;

      if (!map) {
        return;
      }

      const center = map.getCenter();
      const isInside = isPointInsidePolygon(center.lng, center.lat, polygon);

      if (isInside) {
        lastValidCenterRef.current = { lat: center.lat, lng: center.lng };
        return;
      }

      map.panTo(lastValidCenterRef.current, { animate: false });
    },
  };

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

  return (
    <div className={`w-full relative ${className}`}>
      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        maxZoom={20}
        minZoom={15}
        maxBounds={CENTRO_HISTORICO_VIEW_BOUNDS}
        maxBoundsViscosity={0.8}
        whenReady={(event) => {
          mapRef.current = event.target;
        }}
        eventHandlers={mapEvents}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={15}
          maxZoom={20}
        />

        <GeoJSON
          data={CENTRO_HISTORICO_GEOJSON as Feature<Polygon>}
          style={{
            color: "#111111",
            weight: 6,
            opacity: 0.45,
            fillColor: "#ffd400",
            fillOpacity: 0.16,
          }}
        />

        <GeoJSON
          data={CENTRO_HISTORICO_GEOJSON as Feature<Polygon>}
          style={{
            color: "#ffd400",
            weight: 3,
            opacity: 1,
            dashArray: "10 6",
            fillOpacity: 0,
          }}
        />

        <MapMarkers markers={markers} showPopups={showPopups} />
      </MapContainer>

      {!loading && markers.length === 0 && !hasError && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow">
          Nenhum ponto disponivel para exibir.
        </div>
      )}

      {!loading && hasError && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow">
          Nao foi possivel carregar os dados do mapa.
        </div>
      )}
    </div>
  );
}
