import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchitectPreview } from "../ArchitectPreview";
import type { Architect } from "../../types/architect";

const architect: Architect = {
  id: "theodor-wiederspahn",
  slug: "theodor-wiederspahn",
  title: "Theodor Wiederspahn",
  bioSummary: "Resumo vindo do backend.",
  bio: "Biografia vinda do backend.",
  image: {
    src: "/images/architects/theodor.jpg",
    alt: "Theodor Wiederspahn",
  },
};

describe("ArchitectPreview", () => {
  it("renders architect content when required backend fields are present", () => {
    render(
      <ArchitectPreview
        architect={{
          ...architect,
          title: "Arquiteto vindo do backend",
          bio: "Biografia carregada pelo backend.",
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /arquiteto vindo do backend/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/iografia carregada pelo backend/i)
    ).toBeInTheDocument();
  });

  it("does not render when required backend content is missing", () => {
    const { container } = render(
      <ArchitectPreview
        architect={{
          ...architect,
          title: "",
          bio: "",
        }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
