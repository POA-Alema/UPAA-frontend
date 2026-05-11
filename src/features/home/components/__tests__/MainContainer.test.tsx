import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MainContainer from "@/components/layout/MainContainer";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import { getLandingData } from "@/features/home/data/landing";
import { landingMock, landingMockEmpty } from "@/features/home/mocks/landing-mock";

describe("MainContainer (Landing Page)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8080";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("deve renderizar título e descrição do mock", () => {
    render(<MainContainer data={landingMock} />);

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

  it("deve exibir fallback com mock vazio", () => {
    render(<MainContainer data={landingMockEmpty} />);

    expect(screen.getByTestId("landing-fallback")).toBeInTheDocument();

    expect(
      screen.getByText(/nenhum conteúdo disponível/i)
    ).toBeInTheDocument();

    expect(screen.queryByTestId("landing-content")).not.toBeInTheDocument();
  });

  it("deve mockar API e testar sucesso", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "66b4f1f82cc4b99c6d7e1001",
        mainTitle: "O Legado da Arquitetura Alemã",
        subtitle:
          "Explorando edifícios, memórias e instituições que marcaram o Centro Histórico de Porto Alegre.",
      }),
    } as Response);

    const data = await getLandingData();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: "http://localhost:8080/landingPage?lang=pt",
      }),
      {
        cache: "no-store",
      }
    );

    expect(data).toEqual({
      title: "O Legado da Arquitetura Alemã",
      description:
        "Explorando edifícios, memórias e instituições que marcaram o Centro Histórico de Porto Alegre.",
    });
  });

  it("deve testar erro de API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    const data = await getLandingData();

    expect(data).toEqual(landingMock);
  });

  it("deve testar fallback com resposta vazia", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mainTitle: "",
        subtitle: "",
      }),
    } as Response);

    const data = await getLandingData();

    expect(data).toEqual(landingMock);
  });
});
