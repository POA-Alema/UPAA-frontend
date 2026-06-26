import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getImmigrationData } from "../immigration";

describe("getImmigrationData", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it("should return immigration data mapped from landing-page payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          immigrationSection: {
            subtitle: { pt: "Herança cultural, memória e formação do estado" },
            title: { pt: "A importância da imigração" },
            content: { pt: "Conteúdo teste" },
            imageURL: "/images/backend.jpg",
            imgSubtitle: {
              pt: "Imagem vinda do backend",
            },
          },
        }),
      })
    );

    const result = await getImmigrationData();

    expect(result).toEqual({
      subtitle: "Herança cultural, memória e formação do estado",
      title: "A importância da imigração",
      content: "Conteúdo teste",
      image: {
        src: "/images/backend.jpg",
        alt: "Imagem vinda do backend",
        title: undefined,
        description: undefined,
      },
    });
  });

  it("should support payload returned as a list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ([
          {
            immigrationSection: {
              subtitle: { pt: "Subtítulo vindo da lista" },
              title: { pt: "Cidade e memória" },
              content: { pt: "Conteúdo vindo da lista" },
              imageURL: "/images/lista.jpg",
              imgSubtitle: {
                pt: "Legenda da lista",
              },
            },
          },
        ]),
      })
    );

    const result = await getImmigrationData();

    expect(result).toEqual({
      subtitle: "Subtítulo vindo da lista",
      title: "Cidade e memória",
      content: "Conteúdo vindo da lista",
      image: {
        src: "/images/lista.jpg",
        alt: "Legenda da lista",
        title: undefined,
        description: undefined,
      },
    });
  });

  it("should return null when API responds without valid immigration content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          immigrationSection: {
            title: { pt: "" },
            content: { pt: "" },
          },
        }),
      })
    );

    const result = await getImmigrationData();

    expect(result).toBeNull();
  });

  it("should propagate request failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    await expect(getImmigrationData()).rejects.toThrow("Network error");
  });

  it("should call the landing-page endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        immigrationSection: {
          title: { pt: "Título" },
          content: { pt: "Conteúdo" },
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await getImmigrationData();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "http://localhost:3001/landing-page",
      }),
      { next: { revalidate: 3600 } }
    );
  });
});
