import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLinksData } from "../links";
import { linksMock } from "../../mocks/links-mock";

describe("getLinksData", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it("maps links from backend institutions section", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        institutionsSection: {
          title: { pt: "Links do backend" },
          institutions: [
            {
              id: "inst-1",
              title: { pt: "Museu" },
              description: { pt: "Descrição do museu" },
              CTA: {
                label: { pt: "Abrir museu" },
                target: "https://example.com/museu",
              },
            },
          ],
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getLinksData();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "http://localhost:3001/landing-page",
      }),
      { next: { revalidate: 3600 } },
    );
    expect(result).toEqual({
      title: "Links do backend",
      items: [
        {
          id: "inst-1",
          label: "Abrir museu",
          href: "https://example.com/museu",
          description: "Descrição do museu",
        },
      ],
    });
  });

  it("supports payload returned as a list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ([
          {
            institutionsSection: {
              title: { pt: "Links em lista" },
              institutions: [
                {
                  id: "inst-2",
                  title: { pt: "Biblioteca" },
                  CTA: {
                    label: { pt: "Abrir biblioteca" },
                    target: "https://example.com/biblioteca",
                  },
                },
              ],
            },
          },
        ]),
      }),
    );

    const result = await getLinksData();

    expect(result?.title).toBe("Links em lista");
    expect(result?.items[0]?.href).toBe("https://example.com/biblioteca");
  });

  it("returns null when backend responds empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          institutionsSection: {
            title: { pt: "" },
            institutions: [],
          },
        }),
      }),
    );

    const result = await getLinksData();

    expect(result).toBeNull();
  });

  it("falls back to the mock when request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await getLinksData();

    expect(result).toEqual(linksMock);
  });
});