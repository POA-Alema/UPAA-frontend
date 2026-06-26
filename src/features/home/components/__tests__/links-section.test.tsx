import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinksSectionComponent } from "../links-section";
import { linksMock, linksMockEmpty } from "../../mocks/links-mock";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("LinksSectionComponent", () => {
  it("renders the list of links", () => {
    render(<LinksSectionComponent data={linksMock} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      linksMock.title,
    );
    expect(screen.getByText("Acesse")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(linksMock.items.length);
    expect(screen.getByRole("link", { name: /ages/i })).toBeInTheDocument();
  });

  it("opens links in a new tab", () => {
    render(<LinksSectionComponent data={linksMock} />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    });
  });

  it("does not render when data is empty", () => {
    const { container } = render(<LinksSectionComponent data={linksMockEmpty} />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render when data is null", () => {
    const { container } = render(<LinksSectionComponent data={null} />);

    expect(container.firstChild).toBeNull();
  });
});
