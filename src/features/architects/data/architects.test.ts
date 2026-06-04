import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getArchitectBySlug, getFeaturedArchitect, listArchitects } from "./architects";
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

  it("returns the mock collection while the CMS layer is unavailable", async () => {
    const architects = await listArchitects();

    expect(architects).toHaveLength(1);
    expect(architects[0]?.slug).toBe("theodor-wiederspahn");
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
              pt: "A trajetória de Theodor Wiederspahn ajuda a entender parte importante da formação visual e simbólica do Centro Histórico de Porto Alegre.",
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
    expect(architect?.bio).toContain("A trajetória de Theodor Wiederspahn");
    expect(architect?.image?.src).toBe(
      "/images/architects/theodor-wiederspahn.jpg"
    );
    expect(architect?.actions?.primary).toEqual({
      label: "Conhecer arquiteto",
      href: "/architects/theodor-wiederspahn",
    });
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
          content: { pt: "Conteúdo" },
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
    const architect = await getArchitectBySlug("inexistente");

    expect(architect).toBeNull();
  });
});
