import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { immigrationMock } from "../../mocks/immigration-mock";
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
        title: immigrationMock.image?.title,
        description: immigrationMock.image?.description,
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
        title: immigrationMock.image?.title,
        description: immigrationMock.image?.description,
      },
    });
  });

  it("should return the mock as fallback when API responds without valid immigration content", async () => {
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

    expect(result).toEqual(immigrationMock);
  });

  it("should return the mock as fallback when request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await getImmigrationData();

    expect(result).toEqual(immigrationMock);
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
      "http://localhost:3001/landing-page",
      { next: { revalidate: 3600 } }
    );
  });
});
