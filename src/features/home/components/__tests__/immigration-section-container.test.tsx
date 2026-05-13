import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImmigrationSection } from "../immigration-section-container";
import { getImmigrationData } from "../../data/immigration";
import { immigrationMock } from "../../mocks/immigration-mock";

vi.mock("../../data/immigration", () => ({
  getImmigrationData: vi.fn(),
}));

vi.mock("../immigration-section", () => ({
  ImmigrationSectionComponent: ({ data }: { data: any }) => (
    data ? <div data-testid="immigration-component">Content Present</div> : <div data-testid="immigration-empty">No Content</div>
  ),
}));

describe("ImmigrationSection Container", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch data and render the component when data is available", async () => {
    vi.mocked(getImmigrationData).mockResolvedValue(immigrationMock);
    const Result = await ImmigrationSection();
    render(Result);
    expect(getImmigrationData).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("immigration-component")).toBeInTheDocument();
  });

  it("should render empty state when data is null", async () => {
    vi.mocked(getImmigrationData).mockResolvedValue(null);
    const Result = await ImmigrationSection();
    render(Result);
    expect(screen.getByTestId("immigration-empty")).toBeInTheDocument();
  });
});
