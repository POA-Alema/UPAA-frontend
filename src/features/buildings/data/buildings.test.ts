import { describe, expect, it } from "vitest";
import { getBuildingBySlug, getFeaturedBuilding, listBuildings } from "./buildings";

describe("building data layer", () => {
  it("returns the mock collection while the CMS layer is unavailable", async () => {
    const buildings = await listBuildings();

    expect(buildings.length).toBeGreaterThan(0);
    expect(buildings.map((building) => building.slug)).toEqual(
      expect.arrayContaining(["margs", "casa-de-cultura-mario-quintana"]),
    );
  });

  it("returns each building by its slug", async () => {
    const margs = await getBuildingBySlug("margs");
    const ccmq = await getBuildingBySlug("casa-de-cultura-mario-quintana");

    expect(margs?.title).toContain("Museu de Arte");
    expect(ccmq?.title).toContain("Casa de Cultura");
  });

  it("returns the featured building from the same mock source", async () => {
    const building = await getFeaturedBuilding();

    expect(building?.title).toContain("Museu de Arte");
  });

  it("returns null when the requested building does not exist", async () => {
    const building = await getBuildingBySlug("inexistente");

    expect(building).toBeNull();
  });
});
