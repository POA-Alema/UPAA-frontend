import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinksSection } from "../links-section-container";
import { getLinksData } from "../../data/links";
import { linksMock } from "../../mocks/links-mock";

vi.mock("../../data/links", () => ({
  getLinksData: vi.fn(),
}));

vi.mock("../links-section", () => ({
  LinksSectionComponent: ({ data }: { data: { title: string } | null }) => (
    <div data-testid="links-component">{data?.title ?? "No Content"}</div>
  ),
}));

describe("LinksSection Container", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches data and renders the component with the returned payload", async () => {
    vi.mocked(getLinksData).mockResolvedValue(linksMock);

    const result = await LinksSection();

    render(result);

    expect(getLinksData).toHaveBeenCalledTimes(1);
    expect(getLinksData).toHaveBeenCalledWith("pt");
    expect(screen.getByTestId("links-component")).toHaveTextContent(
      linksMock.title,
    );
  });

  it("passes the selected language to the data loader", async () => {
    vi.mocked(getLinksData).mockResolvedValue(linksMock);

    await LinksSection({ lang: "en" });

    expect(getLinksData).toHaveBeenCalledWith("en");
  });
});
