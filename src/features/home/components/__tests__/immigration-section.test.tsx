import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImmigrationSectionComponent } from "../immigration-section";
import { immigrationMock, immigrationMockEmpty } from "../../mocks/immigration-mock";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    "data-testid": dataTestId,
    ...props
  }: {
    src: string;
    alt: string;
    "data-testid"?: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid={dataTestId} {...props} />
  ),
}));

describe("ImmigrationSectionComponent", () => {
  it("should render title and content", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "A Importância da Imigração Alemã para o Estado"
    );
    expect(screen.getByTestId("immigration-content")).toHaveTextContent(
      /A imigração alemã no Rio Grande do Sul teve início/i
    );
  });
  it("should render eyebrow", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);
    expect(
      screen.getByText("Imigração Alemã no Rio Grande do Sul")
    ).toBeInTheDocument();
  });
  it("should render image when present", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);
    const image = screen.getByTestId("immigration-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "alt",
      "Fachada do Museu de Arte do Rio Grande do Sul, edificação histórica no centro de Porto Alegre"
    );
    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
  });
  it("should not render section when data is empty", () => {
    const { container } = render(
      <ImmigrationSectionComponent data={immigrationMockEmpty} />
    );
    expect(container.firstChild).toBeNull();
  });
  it("should not render section when data is null", () => {
    const { container } = render(
      <ImmigrationSectionComponent data={null} />
    );
    expect(container.firstChild).toBeNull();
  });
  it("should render content with proper formatting", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);
    const contentElement = screen.getByTestId("immigration-content");
    expect(contentElement).toBeInTheDocument();
    const paragraphs = contentElement.querySelectorAll("p");
    expect(paragraphs.length).toBeGreaterThan(0);
  });
  it("should emphasize first paragraph", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);
    const firstParagraph = screen.getByTestId("immigration-content").querySelector(
      ".rich-text__paragraph--lead"
    );
    expect(firstParagraph).toBeInTheDocument();
  });
});
