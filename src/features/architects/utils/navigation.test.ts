import { describe, expect, it } from "vitest";
import { resolveArchitectBackToMapHref } from "./navigation";

describe("architect navigation helpers", () => {
  it("falls back to /mapa when returnTo is missing or unsafe", () => {
    expect(resolveArchitectBackToMapHref()).toBe("/mapa");
    expect(
      resolveArchitectBackToMapHref({ returnTo: "https://example.com" }),
    ).toBe("/mapa");
  });

  it("uses the provided returnTo when it is an internal href", () => {
    expect(
      resolveArchitectBackToMapHref({ returnTo: "/mapa?focus=theodor" }),
    ).toBe("/mapa?focus=theodor");
  });
});