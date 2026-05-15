import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

vi.mock("@/features/architects/data/architects", () => ({
  getFeaturedArchitect: vi.fn().mockResolvedValue(null),
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
});
