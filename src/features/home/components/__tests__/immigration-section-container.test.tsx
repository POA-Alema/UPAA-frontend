import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImmigrationSection } from "../immigration-section-container";
import { getImmigrationData } from "../../data/immigration";
import type { ImmigrationSection as ImmigrationSectionData } from "../../types/immigration";

const immigrationData: ImmigrationSectionData = {
  title: "Imigracao vinda do backend",
  content: "Conteudo vindo do backend",
};

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
    vi.mocked(getImmigrationData).mockResolvedValue(immigrationData);

    const result = await ImmigrationSection();

    render(result);

    expect(getImmigrationData).toHaveBeenCalledWith("pt");
    expect(screen.getByTestId("immigration-component")).toHaveTextContent(
      immigrationData.title
    );
  });

  it("should forward the selected language to the data layer", async () => {
    vi.mocked(getImmigrationData).mockResolvedValue(immigrationData);

    const result = await ImmigrationSection({ lang: "en" });

    render(result);

    expect(getImmigrationData).toHaveBeenCalledWith("en");
  });
});
