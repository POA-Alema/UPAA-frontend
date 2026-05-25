"use client";

import L from "leaflet";
import { Marker } from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "/map-marker.svg",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -34],
});

interface MapViewerInnerProps {
  coords: { lat: number; lng: number };
}

export function MapViewerInner({ coords }: MapViewerInnerProps) {
  return <Marker position={[coords.lat, coords.lng]} icon={markerIcon} />;
}
