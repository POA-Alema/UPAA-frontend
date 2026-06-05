"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);

const MapViewerInner = dynamic(
  () => import("./MapViewerInner").then((m) => m.MapViewerInner),
  { ssr: false },
);

interface MapViewerProps {
  coords: { lat: number; lng: number };
}

export default function MapViewer({ coords }: MapViewerProps) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-lg">
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        keyboard={false}
        className="h-full w-full pointer-events-none"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewerInner coords={coords} />
      </MapContainer>
    </div>
  );
}
