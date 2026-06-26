import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getArchitectBySlug,
  getFeaturedArchitect,
  listArchitects,
} from "./architects";

describe("architect data layer", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
      return;
    }

    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it("returns the architect collection from the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "1",
          slug: "theodor-wiederspahn",
          name: "Theodor Wiederspahn",
          biography: "Biografia vinda do banco de dados.",
          summary: "Resumo vindo do banco.",
          imageUrl: "/images/architects/theodor-wiederspahn.jpg",
        },
      ],
    });

    vi.stubGlobal("fetch", fetchMock);

    const architects = await listArchitects();

    expect(architects).toHaveLength(1);
    expect(architects[0]?.slug).toBe("theodor-wiederspahn");
    expect(architects[0]?.title).toBe("Theodor Wiederspahn");
    expect(architects[0]?.bio).toBe("Biografia vinda do banco de dados.");
    expect(architects[0]?.bioSummary).toBe("Resumo vindo do banco.");
    expect(architects[0]?.image?.src).toBe(
      "/images/architects/theodor-wiederspahn.jpg"
    );
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/architects?lang=pt", {
      cache: "no-store",
    });
  });

  it("returns an empty collection when the API has no valid architect content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "1",
            slug: "theodor-wiederspahn",
            name: "Theodor Wiederspahn",
          },
        ],
      })
    );

    const architects = await listArchitects();

    expect(architects).toEqual([]);
  });

  it("propagates the error when the architects API request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    await expect(listArchitects()).rejects.toThrow("Network error");
  });

  it("returns the requested architect from the API by slug endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "1",
        slug: "theodor-wiederspahn",
        name: "Theodor Wiederspahn",
        summary: "Resumo",
        biography: "Biografia completa vinda do banco.",
        relatedBuildings: [
          {
            id: "building-1",
            slug: "margs",
            title: "Museu de Arte do RS",
            imageUrl: "/images/margs/Margs.jpg",
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const architect = await getArchitectBySlug("theodor-wiederspahn");

    expect(architect?.bio).toBe("Biografia completa vinda do banco.");
    expect(architect?.works).toHaveLength(1);
    expect(architect?.works?.[0]?.title).toBe("Museu de Arte do RS");
    expect(architect?.works?.[0]?.href).toBe("/buildings/margs");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/architects/theodor-wiederspahn?lang=pt",
      { cache: "no-store" }
    );
  });

  it("maps the current backend architect detail payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "backend-id",
          slug: "theodor-wiederspahn",
          name: {
            first: "Theodor",
            last: "Wiederspahn",
            full: "Theodor Wiederspahn",
          },
          media: {
            portrait_url: "https://liderpoaalema.s3.us-east-2.amazonaws.com/images/theodor.png",
            alt_text: "Retrato de Theodor Wiederspahn",
          },
          birth: {
            date: { year: 1878 },
            place: { city: "Wiesbaden", country: "Alemanha" },
          },
          death: {
            date: { year: 1953 },
            place: { city: "Porto Alegre", country: "Brasil" },
          },
          citizenship: "alema",
          occupation: "Arquiteto",
          about: "Theodor Wiederspahn foi um arquiteto alemao.",
          characteristics: {
            style: "Arquitetura ecletica.",
            influences: "Formacao europeia.",
            legacy: "Legado historico.",
          },
        }),
      })
    );

    const architect = await getArchitectBySlug("theodor-wiederspahn");

    expect(architect).toEqual(
      expect.objectContaining({
        id: "backend-id",
        slug: "theodor-wiederspahn",
        title: "Theodor Wiederspahn",
        bio: "Theodor Wiederspahn foi um arquiteto alemao.",
        bioSummary: "Theodor Wiederspahn foi um arquiteto alemao.",
        eyebrow: "Arquiteto",
      })
    );
    expect(architect?.image?.src).toBe(
      "https://liderpoaalema.s3.us-east-2.amazonaws.com/images/theodor.png"
    );
    expect(architect?.details).toEqual(
      expect.arrayContaining([
        { label: "Nascimento", value: "1878", subValue: "Wiesbaden, Alemanha" },
        { label: "Falecimento", value: "1953", subValue: "Porto Alegre, Brasil" },
        { label: "Nacionalidade", value: "alema" },
        { label: "Ocupacao", value: "Arquiteto" },
      ])
    );
    expect(architect?.characteristics).toEqual(
      expect.arrayContaining([
        { icon: "architecture", title: "Estilo", description: "Arquitetura ecletica." },
        { icon: "travel_explore", title: "Influencias", description: "Formacao europeia." },
        { icon: "account_balance", title: "Legado", description: "Legado historico." },
      ])
    );
  });

  it("returns null when the slug endpoint returns not found", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    vi.stubGlobal("fetch", fetchMock);

    const architect = await getArchitectBySlug("theodor-wiederspahn");

    expect(architect).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns the featured architect mapped from the landing-page payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          architectSection: {
            imageURL: "/images/architects/theodor-wiederspahn.jpg",
            imageSubtitle: {
              pt: "Theodor Wiederspahn",
            },
            title: {
              pt: "O arquiteto",
            },
            subtitle: {
              pt: "Um nome central na paisagem de Porto Alegre",
            },
            content: {
              pt: "A trajetoria de Theodor Wiederspahn veio do backend.",
            },
            CTA: {
              label: {
                pt: "Conhecer arquiteto",
              },
              target: "/architects/theodor-wiederspahn",
            },
          },
        }),
      })
    );

    const architect = await getFeaturedArchitect();

    expect(architect?.title).toBe("O arquiteto");
    expect(architect?.eyebrow).toBe(
      "Um nome central na paisagem de Porto Alegre"
    );
    expect(architect?.bioSummary).toBe(
      "Um nome central na paisagem de Porto Alegre"
    );
    expect(architect?.bio).toContain("veio do backend");
    expect(architect?.image?.src).toBe(
      "/images/architects/theodor-wiederspahn.jpg"
    );
    expect(architect?.actions?.primary).toEqual({
      label: "Conhecer arquiteto",
      href: "/architects/theodor-wiederspahn",
    });
  });

  it("returns null when the API returns incomplete featured architect content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          architectSection: {
            imageSubtitle: { pt: "Theodor Wiederspahn" },
          },
        }),
      })
    );

    const architect = await getFeaturedArchitect();

    expect(architect).toBeNull();
  });

  it("supports featured architect payload already translated by the backend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          architectSection: {
            imageURL: "/images/architects/theodor-wiederspahn.jpg",
            imageSubtitle: "Theodor Wiederspahn",
            title: "O arquiteto",
            subtitle: "Um nome central",
            content: "Conteudo traduzido pelo backend.",
            CTA: {
              label: "Conhecer arquiteto",
              target: "/architects/theodor-wiederspahn",
            },
          },
        }),
      })
    );

    const architect = await getFeaturedArchitect();

    expect(architect).toEqual(
      expect.objectContaining({
        title: "O arquiteto",
        bio: "Conteudo traduzido pelo backend.",
        eyebrow: "Um nome central",
      })
    );
    expect(architect?.actions?.primary).toEqual({
      label: "Conhecer arquiteto",
      href: "/architects/theodor-wiederspahn",
    });
  });

  it("propagates the error when the featured architect request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    await expect(getFeaturedArchitect()).rejects.toThrow("Network error");
  });

  it("calls the landing-page endpoint for the featured architect preview", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        architectSection: {
          imageSubtitle: { pt: "Theodor Wiederspahn" },
          content: { pt: "Conteudo" },
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await getFeaturedArchitect();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/landing-page?lang=pt",
      { cache: "no-store" }
    );
  });

  it("returns null when the requested architect does not exist", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    vi.stubGlobal("fetch", fetchMock);

    const architect = await getArchitectBySlug("inexistente");

    expect(architect).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
