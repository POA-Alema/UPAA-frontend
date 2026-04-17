import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MainContainer from "@/components/layout/MainContainer";
import MainContainerSkeleton from "@/components/layout/MainContainerSkeleton";
import { landingMock, landingMockEmpty } from "@/features/home/mocks/landing-mock";

describe("MainContainer (Landing Page)", () => {
  it("deve renderizar título e descrição do mock", () => {
    render(<MainContainer data={landingMock} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /o legado alemão na arquitetura de porto alegre/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/explorando as obras que transformaram/i)
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
});
