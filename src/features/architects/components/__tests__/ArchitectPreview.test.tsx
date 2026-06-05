import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchitectPreview } from "../ArchitectPreview";
import { architectsMock } from "../../mocks/architect-mock";

describe("ArchitectPreview", () => {
  const architect = architectsMock[0];

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
