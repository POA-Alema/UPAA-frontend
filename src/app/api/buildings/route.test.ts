import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("GET /api/buildings", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("deve consumir buildings/map e retornar dados adaptados para o mapa", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://backend.test");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([
        {
          id: "1",
          slug: "margs",
          name: "MARGS",
          location: "Centro Historico",
          coordinates: { lat: -30.01, lng: -51.22 },
          current_occupation: "Museu",
          media_gallery: [{ url: "/images/margs/Margs.jpg" }],
        },
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    const data = await response.json();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://backend.test/buildings/map?lang=pt",
      expect.objectContaining({
        cache: "no-store",
      }),
    );
    expect(response.headers.get("x-upaa-fallback")).toBeNull();
    expect(data).toEqual([
      expect.objectContaining({
        id: "1",
        name: "MARGS",
        slug: "margs",
        district: "Centro Historico",
        summary: "Museu",
        latitude: -30.01,
        longitude: -51.22,
      }),
    ]);
  });

  it("deve tentar constructions quando buildings/map nao responder com sucesso", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://backend.test");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn(),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue([
          {
            id: "legacy-id",
            title: "Obra legada",
            latitude: -30,
            longitude: -51,
            images: ["/images/margs/Margs.jpg"],
          },
        ]),
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    const data = await response.json();

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://backend.test/constructions",
      expect.objectContaining({
        cache: "no-store",
      }),
    );
    expect(data).toEqual([
      expect.objectContaining({
        id: "legacy-id",
        name: "Obra legada",
        latitude: -30,
        longitude: -51,
      }),
    ]);
  });

  it("deve retornar fallback quando a API real falhar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const response = await GET();
    const data = await response.json();

    expect(response.headers.get("x-upaa-fallback")).toBe("map-buildings-mock");
    expect(data.length).toBeGreaterThan(0);
  });

  it("deve manter a edificacao no mapa mesmo sem imagem valida, descartando apenas o anexo", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://backend.test");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([
          {
            id: "1",
            slug: "margs",
            name: "MARGS",
            coordinates: { lat: -30.01, lng: -51.22 },
            media_gallery: [{ url: "/images/margs/fachada-inexistente.jpg" }],
          },
        ]),
      }),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.headers.get("x-upaa-fallback")).toBeNull();
    expect(data).toEqual([
      expect.objectContaining({
        id: "1",
        name: "MARGS",
        slug: "margs",
        attachments: [],
      }),
    ]);
  });
});
