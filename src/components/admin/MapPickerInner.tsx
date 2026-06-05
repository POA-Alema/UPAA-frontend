"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -34],
});

interface MapPickerInnerProps {
  initialCoords?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  isEditing?: boolean;
}

export function MapPickerInner({ initialCoords, onChange, isEditing = false }: MapPickerInnerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialCoords ? [initialCoords.lat, initialCoords.lng] : null,
  );

  const map = useMap();

  useEffect(() => {
    if (isEditing) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [isEditing, map]);

  useMapEvents({
    click(e) {
      if (!isEditing) return;
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition([coords.lat, coords.lng]);
      onChange(coords);
    },
  });

  if (!position) return null;

  return <Marker position={position} icon={markerIcon} />;
}
