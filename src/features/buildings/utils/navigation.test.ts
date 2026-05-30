import { describe, expect, it } from "vitest";
import {
  buildBuildingDetailHref,
  resolveBuildingBackToMapHref,
} from "./navigation";

describe("building navigation helpers", () => {
  it("adds the returnTo query param to building detail hrefs", () => {
    expect(buildBuildingDetailHref("margs")).toBe(
      "/buildings/margs?returnTo=%2Fmapa",
    );
  });

  it("falls back to /mapa when returnTo is missing or unsafe", () => {
    expect(resolveBuildingBackToMapHref()).toBe("/mapa");
    expect(
      resolveBuildingBackToMapHref({ returnTo: "https://example.com" }),
    ).toBe("/mapa");
  });

  it("uses the provided returnTo when it is an internal href", () => {
    expect(
      resolveBuildingBackToMapHref({ returnTo: "/mapa?focus=margs" }),
    ).toBe("/mapa?focus=margs");
  });
});