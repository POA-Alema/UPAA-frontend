import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  lang: "pt",
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ lang: mocks.lang }),
}));

import BuildingNotFound from "./not-found";

describe("BuildingNotFound", () => {
  beforeEach(() => {
    mocks.lang = "pt";
  });

  it("renders a consistent fallback with a return-to-map action", () => {
    render(<BuildingNotFound />);

    expect(screen.getByTestId("building-not-found")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /não foi possível carregar esta edificação/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao mapa/i })).toHaveAttribute(
      "href",
      "/mapa",
    );
  });

  it("renders the fallback in the language requested by the route", () => {
    mocks.lang = "en";

    render(<BuildingNotFound />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /this building could not be loaded/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to map/i })).toBeInTheDocument();
  });
});
