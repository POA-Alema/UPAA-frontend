import { beforeEach, describe, expect, it, vi } from "vitest";

const analyticsMocks = vi.hoisted(() => ({
  trackBuildingDetailLoadFailure: vi.fn(),
  trackBuildingDetailLoadSuccess: vi.fn(),
}));

vi.mock("../utils/building-analytics", () => analyticsMocks);

import {
  getBuildingBySlug,
  getFeaturedBuilding,
  listBuildings,
  resolveBuildingLanguage,
} from "./buildings";

describe("building data layer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("returns the mock collection while the CMS layer is unavailable", async () => {
    const buildings = await listBuildings();

    expect(buildings.length).toBeGreaterThan(0);
    expect(buildings.map((building) => building.slug)).toEqual(
      expect.arrayContaining(["margs", "casa-de-cultura-mario-quintana"]),
    );
  });

  it("loads and maps a building from the detail endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "building-1",
          slug: "margs-museu-de-arte-do-rio-grande-do-sul",
          name: "Rio Grande do Sul Museum of Art Ado Malagoli",
          original_name: "Fiscal Delegation Building",
          location: "Praça da Alfândega, Porto Alegre, Brazil",
          construction_period: "1913",
          constructor: "Firma de Rodolfo Ahrons",
          description: "A monumental building.",
          history: "Built in 1913.",
          features: [
            {
              title: {
                pt: "Arquitetura monumental",
                en: "Monumental architecture",
              },
              description: {
                pt: "Fachada marcante.",
                en: "Striking façade.",
              },
              icon_url: "/icons/monumental.svg",
            },
          ],
          media_gallery: [
            {
              url: "/images/buildings/margs/fachada-1.jpg",
              caption: {
                pt: "Fachada principal",
                en: "Main façade",
              },
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const building = await getBuildingBySlug(
      "margs-museu-de-arte-do-rio-grande-do-sul",
      "en",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/buildings/margs-museu-de-arte-do-rio-grande-do-sul?lang=en",
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(building).toMatchObject({
      id: "building-1",
      slug: "margs-museu-de-arte-do-rio-grande-do-sul",
      title: "Rio Grande do Sul Museum of Art Ado Malagoli",
      subtitle: "Fiscal Delegation Building",
      summary: "A monumental building.",
      history: "Built in 1913.",
      characteristics: [
        {
          icon: "architecture",
          title: "Monumental architecture",
          description: "Striking façade.",
        },
      ],
      gallery: [
        {
          alt: "Main façade",
          caption: "Main façade",
        },
      ],
    });
    expect(analyticsMocks.trackBuildingDetailLoadSuccess).toHaveBeenCalledWith({
      slug: "margs-museu-de-arte-do-rio-grande-do-sul",
      language: "en",
      buildingId: "building-1",
      status: 200,
    });
  });

  it("returns the featured building from the same mock source", async () => {
    const building = await getFeaturedBuilding();

    expect(building?.title).toContain("Museu de Arte");
  });

  it("returns null when the detail endpoint responds with 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const building = await getBuildingBySlug("inexistente");

    expect(building).toBeNull();
    expect(analyticsMocks.trackBuildingDetailLoadFailure).toHaveBeenCalledWith({
      slug: "inexistente",
      language: "pt",
      status: 404,
      reason: "not_found",
    });
  });

  it("registers a service-error event for non-success responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const building = await getBuildingBySlug("margs", "de");

    expect(building).toBeNull();
    expect(analyticsMocks.trackBuildingDetailLoadFailure).toHaveBeenCalledWith({
      slug: "margs",
      language: "de",
      status: 500,
      reason: "service_error",
    });
  });

  it("returns null when the detail service fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    const building = await getBuildingBySlug("margs");

    expect(building).toBeNull();
    expect(analyticsMocks.trackBuildingDetailLoadFailure).toHaveBeenCalledWith({
      slug: "margs",
      language: "pt",
      reason: "request_error",
      error: "offline",
    });
  });

  it("falls back to Portuguese for unsupported languages", () => {
    expect(resolveBuildingLanguage("es")).toBe("pt");
    expect(resolveBuildingLanguage(["de", "en"])).toBe("de");
  });
});
