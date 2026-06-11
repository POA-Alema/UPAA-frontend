import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBuildingBySlug: vi.fn(),
  listBuildings: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
}));

vi.mock("@/features/buildings/components/BuildingPage", () => ({
  BuildingPage: () => null,
}));

vi.mock("@/features/buildings/data/buildings", () => ({
  getBuildingBySlug: mocks.getBuildingBySlug,
  listBuildings: mocks.listBuildings,
  resolveBuildingLanguage: (value?: string | string[]) => {
    const language = Array.isArray(value) ? value[0] : value;
    return language === "en" || language === "de" ? language : "pt";
  },
}));

import BuildingDetailPage from "./page";

describe("BuildingDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    expect(mocks.getBuildingBySlug).toHaveBeenCalledWith("margs", "pt");
  });

  it("passes a supported language to the detail data layer", async () => {
    mocks.getBuildingBySlug.mockResolvedValue({
      id: "margs",
      slug: "margs",
      summary: "Summary",
      title: "Museum",
      history: "History",
    });

    await BuildingDetailPage({
      params: Promise.resolve({ slug: "margs" }),
      searchParams: Promise.resolve({ lang: "en" }),
    });

    expect(mocks.getBuildingBySlug).toHaveBeenCalledWith("margs", "en");
  });

  it("uses the not-found fallback when the slug is not found", async () => {
    mocks.getBuildingBySlug.mockResolvedValue(null);

    await expect(
      BuildingDetailPage({
        params: Promise.resolve({ slug: "inexistente" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.notFound).toHaveBeenCalledOnce();
  });
});
