import { describe, expect, it } from "vitest";
import {
  buildBuildingDetailHref,
  resolveBuildingBackToMapHref,
} from "./navigation";

describe("buildBuildingDetailHref", () => {
  it("uses /mapa as the default returnTo", () => {
    expect(buildBuildingDetailHref("margs")).toBe(
      "/buildings/margs?returnTo=%2Fmapa",
    );
  });

  it("uses a custom internal returnTo when provided", () => {
    expect(buildBuildingDetailHref("margs", "/mapa?focus=margs")).toBe(
      "/buildings/margs?returnTo=%2Fmapa%3Ffocus%3Dmargs",
    );
  });

  it("omits the query param when returnTo is an external URL", () => {
    expect(buildBuildingDetailHref("margs", "https://evil.com")).toBe(
      "/buildings/margs",
    );
  });

  it("omits the query param when returnTo is protocol-relative", () => {
    expect(buildBuildingDetailHref("margs", "//evil.com")).toBe(
      "/buildings/margs",
    );
  });
});

describe("resolveBuildingBackToMapHref", () => {
  it("falls back to /mapa when searchParams are absent", () => {
    expect(resolveBuildingBackToMapHref()).toBe("/mapa");
  });

  it("falls back to /mapa when returnTo is an external URL", () => {
    expect(
      resolveBuildingBackToMapHref({ returnTo: "https://example.com" }),
    ).toBe("/mapa");
  });

  it("falls back to /mapa when returnTo is protocol-relative", () => {
    expect(resolveBuildingBackToMapHref({ returnTo: "//" })).toBe("/mapa");
  });

  it("uses the provided returnTo when it is an internal href", () => {
    expect(
      resolveBuildingBackToMapHref({ returnTo: "/mapa?focus=margs" }),
    ).toBe("/mapa?focus=margs");
  });

  it("uses the first value when returnTo is an array", () => {
    expect(
      resolveBuildingBackToMapHref({ returnTo: ["/mapa", "/outro"] }),
    ).toBe("/mapa");
  });

  it("uses a custom fallbackHref when returnTo is absent", () => {
    expect(resolveBuildingBackToMapHref(undefined, "/custom")).toBe("/custom");
  });
});
