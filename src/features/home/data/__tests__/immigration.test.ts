import { describe, it, expect, vi } from "vitest";

import { getImmigrationData } from "../immigration";

describe("getImmigrationData", () => {
  it("should return immigration data when API responds with content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          eyebrow: "Imigração Alemã",
          content: "Conteúdo teste",
        }),
      })
    );

    const result = await getImmigrationData();

    expect(result).toEqual({
      eyebrow: "Imigração Alemã",
      content: "Conteúdo teste",
    });
  });

  it("should return null when API responds without content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          eyebrow: "",
          content: "",
        }),
      })
    );

    const result = await getImmigrationData();

    expect(result).toBeNull();
  });

  it("should return null when request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const result = await getImmigrationData();

    expect(result).toBeNull();
  });
});