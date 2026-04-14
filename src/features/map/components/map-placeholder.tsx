"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  mapBuildingsToMarkers,
  MapMarker,
  Building,
} from "@/features/map/utils/map-buildings";
import { MapMarkers } from "./map-markers";

import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

export function MapPlaceholder() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {/*
      Deixei essa parte comentada pra conseguir ver os pontos no mapa enquanto ainda não temos os dados das edificacoes
      const data: Building[] = [
        {
          id: 1,
          name: "Teatro São Pedro",
          latitude: -30.0303,
          longitude: -51.2296,
        },
        {
          id: 2,
          name: "Casa de Cultura Mario Quintana",
          latitude: -30.0316,
          longitude: -51.2310,
        },
        {
          id: 3,
          name: "Sem coordenada",
        },
      ];
      */
      const data: Building[] = [];
      const mappedMarkers = mapBuildingsToMarkers(data);

      setMarkers(mappedMarkers);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="w-full h-[500px] relative">
      <MapContainer
        center={[-30.0277, -51.2287]}
        zoom={15}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapMarkers markers={markers} />
      </MapContainer>

      {!loading && markers.length === 0 && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow">
          Dados de localização indisponíveis
        </div>
      )}
    </div>
  );
}