import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ImmigrationSectionComponent } from "../immigration-section";
import { immigrationMock, immigrationMockEmpty } from "../../mocks/immigration-mock";

describe("ImmigrationSectionComponent", () => {
  it("should render title and content", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      immigrationMock.title
    );
    expect(screen.getByTestId("immigration-content")).toHaveTextContent(
      /A imigração alemã no Rio Grande do Sul teve início/i
    );
  });

  it("should render image when present", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    const image = screen.getByTestId("immigration-image");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", immigrationMock.image?.alt);
    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
  });

  it("should fallback to the mock image when backend image is missing", () => {
    render(
      <ImmigrationSectionComponent
        data={{
          title: "Cidade e memória",
          content: "Conteúdo válido",
        }}
      />
    );

    const image = screen.getByTestId("immigration-image");

    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
    expect(image).toHaveAttribute("alt", immigrationMock.image?.alt);
  });

  it("should fallback to the mock image when backend image fails to load", () => {
    render(
      <ImmigrationSectionComponent
        data={{
          title: "Cidade e memória",
          content: "Conteúdo válido",
          image: {
            src: "/images/quebrada.jpg",
            alt: "Imagem quebrada",
          },
        }}
      />
    );

    const image = screen.getByTestId("immigration-image");

    fireEvent.error(image);

    expect(screen.getByTestId("immigration-image")).toHaveAttribute(
      "src",
      immigrationMock.image?.src
    );
    expect(screen.getByTestId("immigration-image")).toHaveAttribute(
      "alt",
      immigrationMock.image?.alt
    );
  });

  it("should not render section when title is empty", () => {
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
    const paragraphs = contentElement.querySelectorAll("p");

    expect(contentElement).toBeInTheDocument();
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it("should emphasize first paragraph", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    const firstParagraph = screen
      .getByTestId("immigration-content")
      .querySelector(".rich-text__paragraph--lead");

    expect(firstParagraph).toBeInTheDocument();
  });
});
