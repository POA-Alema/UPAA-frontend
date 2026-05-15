"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapMarker, Building } from "@/features/map/utils/map-buildings";
import { mapBuildingsToMarkers } from "@/features/map/utils/map-buildings";

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

export function MapPlaceholder({
  className = "h-125",
  showPopups = true,
  showZoomControls,
}: MapPlaceholderProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
        center={[-30.0277, -51.2287]}
        zoom={15}
        maxZoom={20}
        minZoom={15}
        zoomControl={typeof showZoomControls === 'boolean' ? showZoomControls : showPopups}
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
