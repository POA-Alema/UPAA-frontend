import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAP_CENTER,
  DISTANCE_LIMIT_METERS,
  getDistanceInMeters,
  getRecentralizationStatus,
} from "./location";

describe("location utilities", () => {
  it("calculates distance in meters between two points", () => {
    const from = { latitude: -30.020, longitude: -51.220 };
    const to = DEFAULT_MAP_CENTER;

    const distance = getDistanceInMeters(from, to);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(5000);
  });

  it("does not request recentralization when the user is within the distance limit", () => {
    const position = {
      coords: {
        latitude: DEFAULT_MAP_CENTER.latitude + 0.001,
        longitude: DEFAULT_MAP_CENTER.longitude + 0.001,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    } as GeolocationPosition;

    const result = getRecentralizationStatus(position, null, DEFAULT_MAP_CENTER, DISTANCE_LIMIT_METERS);

    expect(result.shouldRecenter).toBe(false);
    expect(result.reason).toBeNull();
    expect(result.distanceMeters).toBeDefined();
    expect(result.distanceMeters).toBeLessThan(DISTANCE_LIMIT_METERS);
  });

  it("requests recentralization when the user is outside the distance limit", () => {
    const position = {
      coords: {
        latitude: DEFAULT_MAP_CENTER.latitude + 0.05,
        longitude: DEFAULT_MAP_CENTER.longitude + 0.05,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    } as GeolocationPosition;

    const result = getRecentralizationStatus(position, null, DEFAULT_MAP_CENTER, DISTANCE_LIMIT_METERS);

    expect(result.shouldRecenter).toBe(true);
    expect(result.reason).toBe("outside_limit");
    expect(result.distanceMeters).toBeGreaterThan(DISTANCE_LIMIT_METERS);
  });

  it("requests recentralization when permission is denied", () => {
    const error = {
      code: 1,
      message: "User denied Geolocation",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError;

    const result = getRecentralizationStatus(null, error, DEFAULT_MAP_CENTER, DISTANCE_LIMIT_METERS);

    expect(result.shouldRecenter).toBe(true);
    expect(result.reason).toBe("permission_denied");
    expect(result.distanceMeters).toBeUndefined();
  });
});
