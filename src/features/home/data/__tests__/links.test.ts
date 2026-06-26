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
              description: { pt: "Descricao do museu" },
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
      title: "Parceiros Institucionais",
      items: [
        {
          id: "inst-1",
          label: "Museu",
          href: "https://example.com/museu",
          description: "Descricao do museu",
        },
      ],
    });
  });

  it("falls back to the CTA label when the institution title is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          institutionsSection: {
            institutions: [
              {
                id: "inst-cta",
                CTA: {
                  label: { pt: "AGES" },
                  target: "https://www.ages.pucrs.br/",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await getLinksData();

    expect(result?.items[0]?.label).toBe("AGES");
  });

  it("maps localized backend fields by selected language", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          institutionsSection: {
            institutions: [
              {
                id: "inst-localized",
                title: {
                  pt: "Parceiro",
                  en: "Partner",
                  de: "Partner DE",
                },
                description: {
                  pt: "Descricao",
                  en: "Description",
                  de: "Beschreibung",
                },
                CTA: {
                  target: "https://example.com/partner",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await getLinksData("en");

    expect(result?.title).toBe("Institutional Partners");
    expect(result?.items[0]).toEqual({
      id: "inst-localized",
      label: "Partner",
      href: "https://example.com/partner",
      description: "Description",
    });
  });

  it("supports payload returned as a list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
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
        ],
      }),
    );

    const result = await getLinksData();

    expect(result?.title).toBe("Parceiros Institucionais");
    expect(result?.items[0]?.href).toBe("https://example.com/biblioteca");
  });

  it("keeps only two links by default", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          institutionsSection: {
            institutions: [
              {
                id: "inst-1",
                title: { pt: "DELFOS" },
                CTA: { target: "https://www.pucrs.br/delfos/" },
              },
              {
                id: "inst-2",
                title: { pt: "AGES" },
                CTA: { target: "https://www.ages.pucrs.br/" },
              },
              {
                id: "inst-3",
                title: { pt: "Outro" },
                CTA: { target: "https://example.com/outro" },
              },
            ],
          },
        }),
      }),
    );

    const result = await getLinksData();

    expect(result?.items).toHaveLength(2);
    expect(result?.items.map((item) => item.label)).toEqual(["DELFOS", "AGES"]);
  });

  it("falls back to the mock when backend only returns internal building links", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          institutionsSection: {
            institutions: [
              {
                id: "inst-margs",
                title: { pt: "MARGS" },
                CTA: {
                  target: "/buildings/margs-museu-de-arte-do-rio-grande-do-sul",
                },
              },
              {
                id: "inst-memorial",
                title: { pt: "Memorial do RS" },
                CTA: {
                  target: "/buildings/memorial-do-rio-grande-do-sul",
                },
              },
            ],
          },
        }),
      }),
    );

    const result = await getLinksData("de");

    expect(result?.title).toBe("Institutionelle Partner");
    expect(result?.items.map((item) => item.label)).toEqual(["DELFOS", "AGES"]);
  });

  it("falls back to the mock when backend responds empty", async () => {
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

    expect(result).toEqual(linksMock);
  });

  it("falls back to the mock when request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await getLinksData();

    expect(result).toEqual(linksMock);
  });
});
