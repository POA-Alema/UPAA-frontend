import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MainContainer from "@/components/layout/MainContainer";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import { getLandingData } from "@/features/home/data/landing";
import type { LandingData } from "@/features/home/types/landing";

const landingData: LandingData = {
  title: "Uma Porto Alegre alemã",
  description: "Arquitetura, memória e cidade.",
};

describe("MainContainer (Landing Page)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8080";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("deve renderizar título e descrição quando há dados", () => {
    render(<MainContainer data={landingData} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /o legado da arquitetura alemã/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/explorando edifícios, memórias e instituições/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId("landing-content")).toBeInTheDocument();
  });

  it("deve exibir loading (skeleton)", () => {
    render(<MainContainerSkeleton />);

    expect(screen.getByTestId("landing-loading")).toBeInTheDocument();
  });

  it("não deve renderizar conteúdo quando data é null", () => {
    const { container } = render(<MainContainer data={null} />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("landing-content")).not.toBeInTheDocument();
  });

  it("deve mockar API e testar sucesso", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "66b4f1f82cc4b99c6d7e1001",
          mainTitle: {
            pt: "Uma Porto Alegre alemã",
          },
          subtitle: {
            pt: "Arquitetura, memória e cidade a partir do legado de Theodor Wiederspahn.",
          },
        },
      ],
    } as Response);

    const data = await getLandingData();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "http://localhost:8080/landing-page?lang=pt",
      }),
      {
        next: { revalidate: 3600 },
      }
    );

    expect(data).toEqual({
      title: "Uma Porto Alegre alemã",
      description:
        "Arquitetura, memória e cidade a partir do legado de Theodor Wiederspahn.",
    });
  });

  it("deve testar erro de API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await expect(getLandingData()).rejects.toThrow(
      "Erro 500: nao foi possivel carregar a landing page."
    );
  });

  it("deve retornar null com resposta vazia", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mainTitle: { pt: "" },
        subtitle: { pt: "" },
      }),
    } as Response);

    const data = await getLandingData();

    expect(data).toBeNull();
  });

  it("deve propagar erro quando a requisição falha", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network error"));

    await expect(getLandingData()).rejects.toThrow("network error");
  });
});
