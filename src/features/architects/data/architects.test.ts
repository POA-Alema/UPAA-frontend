import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getArchitectBySlug,
  getFeaturedArchitect,
  listArchitects,
} from "./architects";
import { architectsMock } from "../mocks/architect-mock";

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
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/architects", {
      next: { revalidate: 3600 },
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
            title: "Theodor Wiederspahn",
          },
        ],
      })
    );

    const architects = await listArchitects();

    expect(architects).toEqual([]);
  });

  it("returns the mock collection when the architects API request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const architects = await listArchitects();

    expect(architects).toEqual(architectsMock);
  });

  it("returns the requested architect from the API by slug", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "1",
            slug: "theodor-wiederspahn",
            title: "Theodor Wiederspahn",
            bioSummary: "Resumo",
            bio: "Biografia completa vinda do banco.",
          },
        ],
      })
    );

    const architect = await getArchitectBySlug("theodor-wiederspahn");

    expect(architect?.bio).toBe("Biografia completa vinda do banco.");
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

  it("returns null for the featured architect when the API has no content", async () => {
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

  it("returns the featured architect from the mock source when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const architect = await getFeaturedArchitect();

    expect(architect).toEqual(architectsMock[0]);
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
      "http://localhost:3001/landing-page",
      { next: { revalidate: 3600 } }
    );
  });

  it("returns null when the requested architect does not exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "1",
            slug: "theodor-wiederspahn",
            title: "Theodor Wiederspahn",
            bioSummary: "Resumo",
            bio: "Biografia completa vinda do banco.",
          },
        ],
      })
    );

    const architect = await getArchitectBySlug("inexistente");

    expect(architect).toBeNull();
  });
});
