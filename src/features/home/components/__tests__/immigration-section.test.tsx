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
  }: any) => (
    <img src={src} alt={alt} data-testid={dataTestId} {...props} />
  ),
}));

describe("ImmigrationSectionComponent", () => {
  it("should render title and content", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    expect(
      screen.getByText("A IMPORTÂNCIA DA IMIGRAÇÃO ALEMÃ PARA O ESTADO")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A imigração alemã no Rio Grande do Sul teve início/i)
    ).toBeInTheDocument();
  });

  it("should render eyebrow", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    expect(
      screen.getByText("IMIGRAÇÃO ALEMÃ NO RIO GRANDE DO SUL")
    ).toBeInTheDocument();
  });

  it("should render image when present", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    const image = screen.getByTestId("immigration-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "alt",
      "Celebração da imigração alemã no Rio Grande do Sul com pessoas em trajes típicos alemães e bandeira alemã"
    );
    expect(image).toHaveAttribute("src", "/images/Margs.jpg");
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

    // RichText component should format content into paragraphs
    const contentElement = screen.getByTestId("immigration-content");
    expect(contentElement).toBeInTheDocument();

    // Check if paragraphs are rendered
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

