import { describe, expect, it } from "vitest";
import { buildExternalRouteUrl } from "./external-route";

describe("buildExternalRouteUrl", () => {
  it("builds a Google Maps directions url with coordinates", () => {
    const result = buildExternalRouteUrl({
      latitude: -30.029111,
      longitude: -51.231694,
    });

    expect(result).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=-30.029111%2C-51.231694",
    );
  });

  it("returns null when coordinates are missing", () => {
    expect(
      buildExternalRouteUrl({ latitude: undefined, longitude: -51.2 }),
    ).toBeNull();
  });

  it("returns null when coordinates are out of range", () => {
    expect(buildExternalRouteUrl({ latitude: -91, longitude: 10 })).toBeNull();
    expect(buildExternalRouteUrl({ latitude: 10, longitude: 181 })).toBeNull();
  });
});
