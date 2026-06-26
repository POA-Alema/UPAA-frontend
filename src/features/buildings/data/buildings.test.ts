import { afterEach, describe, expect, it, vi } from "vitest";
import { getBuildingBySlug, getFeaturedBuilding, listBuildings } from "./buildings";

const apiBuilding = {
  id: "margs",
  slug: "margs",
  name: { pt: "Museu de Arte do Rio Grande do Sul" },
  description: { pt: "Antiga Delegacia Fiscal da Fazenda." },
  history: { pt: "Historia vinda do backend." },
  location: { pt: "Centro Historico" },
  construction_period: { pt: "1913" },
  architect: { slug: "joao-da-silva", name: { first: "Joao", last: "da Silva" } },
  media_gallery: [
    {
      url: "/images/margs/Margs.jpg",
      caption: { pt: "Fachada" },
      title: { pt: "Imagem da fachada" },
      description: { pt: "Descricao da imagem" },
    },
  ],
};

describe("building data layer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns the building collection from the API", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3001");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [apiBuilding],
    });
    vi.stubGlobal("fetch", fetchMock);

    const buildings = await listBuildings();

    expect(buildings).toHaveLength(1);
    expect(buildings[0]).toEqual(
      expect.objectContaining({
        id: "margs",
        slug: "margs",
        title: "Museu de Arte do Rio Grande do Sul",
        summary: "Antiga Delegacia Fiscal da Fazenda.",
        history: "Historia vinda do backend.",
      }),
    );
    expect(buildings[0]?.gallery?.[0]).toEqual(
      expect.objectContaining({
        src: "/images/margs/Margs.jpg",
        title: "Imagem da fachada",
        description: "Descricao da imagem",
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/buildings?lang=pt",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("propagates errors when the building collection request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(listBuildings()).rejects.toThrow("offline");
  });

  it("returns each building by its slug from the API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => apiBuilding,
    }));

  const building = await getBuildingBySlug("margs");

  expect(building?.title).toBe("Museu de Arte do Rio Grande do Sul");
  expect(building?.architectCta?.href).toBe("/architects/joao-da-silva");
  expect(building?.architectCta?.description).toContain("Joao da Silva");
  });

  it("returns the featured building from the API collection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [apiBuilding],
    }));

    const building = await getFeaturedBuilding();

    expect(building?.title).toBe("Museu de Arte do Rio Grande do Sul");
  });

  it("returns null when the requested building does not exist", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    const building = await getBuildingBySlug("inexistente");

    expect(building).toBeNull();
  });
});
