import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { getFeaturedArchitect } from "@/features/architects/data/architects";
import type { Architect } from "@/features/architects/types/architect";

const featuredArchitect: Architect = {
  id: "theodor-wiederspahn",
  slug: "theodor-wiederspahn",
  title: "Theodor Wiederspahn",
  bioSummary: "Resumo vindo do backend.",
  bio: "Biografia vinda do backend.",
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({ get: () => undefined }),
}));

vi.mock("@/features/architects/data/architects", () => ({
  getFeaturedArchitect: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/features/architects/components/ArchitectPreview", () => ({
  ArchitectPreview: ({ architect }: { architect: { title: string } }) => (
    <div data-testid="architect-preview">{architect.title}</div>
  ),
}));

vi.mock("@/features/home/components/landing-content", () => ({
  LandingContent: () => <div data-testid="landing-content">Landing</div>,
}));

vi.mock("@/features/home/components/map-preview-section", () => ({
  MapPreviewSection: () => <div data-testid="map-preview-section">Map</div>,
}));

vi.mock("@/features/home/components/immigration-section-container", () => ({
  ImmigrationSection: () => (
    <div data-testid="immigration-section-container">Immigration</div>
  ),
}));

vi.mock("@/components/layout/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/layout/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("HomePage", () => {
  it("should render the immigration container in the real page flow", async () => {
    const result = await HomePage();

    render(result);

    expect(
      screen.getByTestId("immigration-section-container")
    ).toBeInTheDocument();
  });

  it("should render the architect preview when featured architect data is available", async () => {
    vi.mocked(getFeaturedArchitect).mockResolvedValue(featuredArchitect);

    const result = await HomePage();

    render(result);

    expect(screen.getByTestId("architect-preview")).toHaveTextContent(
      "Theodor Wiederspahn"
    );
  });
});
