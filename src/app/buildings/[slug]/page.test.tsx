import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBuildingBySlug: vi.fn(),
  listBuildings: vi.fn(),
}));

vi.mock("@/features/buildings/components/BuildingPage", () => ({
  BuildingPage: () => null,
}));

vi.mock("@/features/buildings/data/buildings", () => ({
  getBuildingBySlug: mocks.getBuildingBySlug,
  listBuildings: mocks.listBuildings,
}));

import BuildingDetailPage from "./page";

describe("BuildingDetailPage", () => {
  it("passes the resolved return-to-map href to the building page", async () => {
    const building = {
      id: "margs",
      slug: "margs",
      summary: "Resumo",
      title: "Museu",
      history: "Historia",
    };

    mocks.getBuildingBySlug.mockResolvedValue(building);
    mocks.listBuildings.mockResolvedValue([]);

    const result = await BuildingDetailPage({
      params: Promise.resolve({ slug: "margs" }),
      searchParams: Promise.resolve({ returnTo: "/mapa" }),
    });

    expect(result).toMatchObject({
      props: {
        backToMapHref: "/mapa",
        building,
      },
    });
  });
});