"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { isPointInsideCentroHistorico } from "@/features/map/constants/centro-historico-boundary";

type MapRecenterControllerProps = {
  center: [number, number];
  onMapReady?: (map: LeafletMap) => void;
  onOutsideLimit?: () => void;
};

const DEFAULT_ZOOM = 15;

export function MapRecenterController({
  center,
  onMapReady,
  onOutsideLimit,
}: MapRecenterControllerProps) {
  const map = useMap();
  const isRecentering = useRef(false);

  useEffect(() => {
    onMapReady?.(map);
  }, [map, onMapReady]);

  useEffect(() => {
    isRecentering.current = true;
    map.flyTo(center, DEFAULT_ZOOM, { duration: 1.2 });
  }, [center, map]);

  useEffect(() => {
    const handleMoveEnd = () => {
      if (isRecentering.current) {
        isRecentering.current = false;
        return;
      }

      const currentCenter = map.getCenter();
      const isInsideCentroHistorico = isPointInsideCentroHistorico(
        currentCenter.lng,
        currentCenter.lat,
      );

      if (!isInsideCentroHistorico) {
        isRecentering.current = true;
        map.flyTo(center, DEFAULT_ZOOM, { duration: 1.2 });
        onOutsideLimit?.();
      }
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [center, map, onOutsideLimit]);

  return null;
}
