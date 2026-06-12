"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);

const MapPickerInner = dynamic(
  () => import("./MapPickerInner").then((m) => m.MapPickerInner),
  { ssr: false },
);

const POA_CENTER: [number, number] = [-30.0277, -51.2287];

export interface MapPickerProps {
  initialCoords?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}

export default function MapPicker({ initialCoords, onChange }: MapPickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const center: [number, number] = initialCoords
    ? [initialCoords.lat, initialCoords.lng]
    : POA_CENTER;
  const hasCoords = initialCoords != null;

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg" style={{ cursor: isEditing ? "crosshair" : "default" }}>
      <MapContainer
        center={center}
        zoom={14}
        zoomControl
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPickerInner initialCoords={initialCoords} onChange={onChange} isEditing={isEditing} />
      </MapContainer>

      {/* Overlay bloqueador — intercepta scroll e cliques quando não está editando */}
      {!isEditing && (
        <div
          className="absolute inset-0 z-[500] flex cursor-pointer flex-col items-center justify-center gap-2"
          style={{ background: 'rgba(14,12,11,0.55)', backdropFilter: 'blur(1px)' }}
          onClick={() => setIsEditing(true)}
        >
          <span className="material-symbols-outlined text-4xl" style={{ color: 'var(--accent-strong)' }}>
            edit_location_alt
          </span>
          <p className="text-sm font-semibold" style={{ color: 'rgba(231,225,223,0.9)' }}>
            {hasCoords ? "Clique para alterar a localização" : "Clique para definir a localização no mapa"}
          </p>
        </div>
      )}

      {/* Botão de saída do modo de edição */}
      {isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="absolute bottom-3 right-3 z-[500] flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#151312' }}
        >
          <span className="material-symbols-outlined text-sm">check</span>
          Concluído
        </button>
      )}
    </div>
  );
}
