export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export const DEFAULT_MAP_CENTER: GeoPoint = {
  latitude: -30.0277,
  longitude: -51.2287,
};

export const DISTANCE_LIMIT_METERS = 1200;

export type RecentralizationReason =
  | "outside_limit"
  | "permission_denied"
  | "unavailable"
  | null;

export type RecentralizationStatus = {
  shouldRecenter: boolean;
  reason: RecentralizationReason;
  distanceMeters?: number;
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function getDistanceInMeters(from: GeoPoint, to: GeoPoint): number {
  const earthRadiusMeters = 6_371_000;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const latitudeA = toRadians(from.latitude);
  const latitudeB = toRadians(to.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

export function getRecentralizationStatus(
  position: GeolocationPosition | null,
  error: GeolocationPositionError | null,
  center: GeoPoint = DEFAULT_MAP_CENTER,
  limitMeters: number = DISTANCE_LIMIT_METERS,
): RecentralizationStatus {
  if (position && position.coords) {
    const userLocation: GeoPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    const distanceMeters = getDistanceInMeters(userLocation, center);

    if (distanceMeters > limitMeters) {
      return {
        shouldRecenter: true,
        reason: "outside_limit",
        distanceMeters,
      };
    }

    return {
      shouldRecenter: false,
      reason: null,
      distanceMeters,
    };
  }

  if (error) {
    return {
      shouldRecenter: true,
      reason:
        error.code === error.PERMISSION_DENIED
          ? "permission_denied"
          : "unavailable",
    };
  }

  return {
    shouldRecenter: false,
    reason: null,
  };
}
