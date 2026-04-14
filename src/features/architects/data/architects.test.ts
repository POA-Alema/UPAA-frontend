import { describe, expect, it } from "vitest";
import { getArchitectBySlug, getFeaturedArchitect, listArchitects } from "./architects";

describe("architect data layer", () => {
  it("returns the mock collection while the CMS layer is unavailable", async () => {
    const architects = await listArchitects();

    expect(architects).toHaveLength(1);
    expect(architects[0]?.slug).toBe("theodor-wiederspahn");
  });

  it("returns the featured architect from the same mock source", async () => {
    const architect = await getFeaturedArchitect();

    expect(architect?.title).toBe("Theodor Wiederspahn");
  });

  it("returns null when the requested architect does not exist", async () => {
    const architect = await getArchitectBySlug("inexistente");

    expect(architect).toBeNull();
  });
});
