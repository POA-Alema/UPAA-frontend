import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { architectsMock } from "@/features/architects/mocks/architect-mock";
import { getFeaturedArchitect } from "@/features/architects/data/architects";

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

vi.mock("@/features/home/components/links-section-container", () => ({
  LinksSection: () => <div data-testid="links-section-container">Links</div>,
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

    expect(screen.getByTestId("links-section-container")).toBeInTheDocument();
    expect(
      screen.getByTestId("immigration-section-container")
    ).toBeInTheDocument();
  });

  it("should render the architect preview when featured architect data is available", async () => {
    vi.mocked(getFeaturedArchitect).mockResolvedValue(architectsMock[0]);

    const result = await HomePage();

    render(result);

    expect(screen.getByTestId("architect-preview")).toHaveTextContent(
      "Theodor Wiederspahn"
    );
  });
});
