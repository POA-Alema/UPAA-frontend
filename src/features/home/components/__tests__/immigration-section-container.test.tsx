import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImmigrationSection } from "../immigration-section-container";
import { getImmigrationData } from "../../data/immigration";
import { immigrationMock } from "../../mocks/immigration-mock";

vi.mock("../../data/immigration", () => ({
  getImmigrationData: vi.fn(),
}));

vi.mock("../immigration-section", () => ({
  ImmigrationSectionComponent: ({ data }: { data: { title: string } | null }) => (
    <div data-testid="immigration-component">{data?.title ?? "No Content"}</div>
  ),
}));

describe("ImmigrationSection Container", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch data and render the component with the returned payload", async () => {
    vi.mocked(getImmigrationData).mockResolvedValue(immigrationMock);

    const result = await ImmigrationSection();

    render(result);

    expect(getImmigrationData).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("immigration-component")).toHaveTextContent(
      immigrationMock.title
    );
  });
});
