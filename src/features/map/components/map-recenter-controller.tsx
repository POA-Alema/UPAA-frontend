"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import {
  DEFAULT_MAP_CENTER,
  DISTANCE_LIMIT_METERS,
  getDistanceInMeters,
} from "@/features/map/utils/location";
import type { Map as LeafletMap } from "leaflet";

type MapRecenterControllerProps = {
  center: [number, number];
  limitMeters?: number;
  onMapReady?: (map: LeafletMap) => void;
  onOutsideLimit?: () => void;
};

const DEFAULT_ZOOM = 15;

export function MapRecenterController({
  center,
  limitMeters = DISTANCE_LIMIT_METERS,
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
      const distanceMeters = getDistanceInMeters(
        {
          latitude: currentCenter.lat,
          longitude: currentCenter.lng,
        },
        DEFAULT_MAP_CENTER,
      );

      if (distanceMeters > limitMeters) {
        isRecentering.current = true;
        map.flyTo(center, DEFAULT_ZOOM, { duration: 1.2 });
        onOutsideLimit?.();
      }
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [center, limitMeters, map, onOutsideLimit]);

  return null;
}
