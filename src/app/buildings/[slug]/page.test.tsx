import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBuildingBySlug: vi.fn(),
  listBuildings: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  }),
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

    // Page now renders <div><Header /><main><BuildingPage .../></main><Footer /></div>
    const main = result.props.children[1];
    const buildingPageEl = main.props.children;
    expect(buildingPageEl.props).toMatchObject({
      backToMapHref: "/mapa",
      building,
    });
  });
});