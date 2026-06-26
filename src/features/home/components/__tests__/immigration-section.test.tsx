import type { ComponentPropsWithoutRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ImmigrationSectionComponent } from "../immigration-section";
import { immigrationMock } from "../../mocks/immigration-mock";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/features/i18n", () => ({ default: {} }));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    onError,
    fill,
    priority,
    sizes,
    ...props
  }: ComponentPropsWithoutRef<"img"> & { fill?: boolean; priority?: boolean }) => {
    void fill;
    void priority;
    void sizes;
    void props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} onError={onError} />;
  },
}));

describe("ImmigrationSectionComponent", () => {
  it("should render title and content", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    expect(screen.getByText("immigration.eyebrow")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "immigration.title",
    );
    expect(screen.getByTestId("immigration-content")).toHaveTextContent(
      "immigration.content",
    );
  });

  it("should render image when present", () => {
    render(<ImmigrationSectionComponent data={immigrationMock} />);

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "immigration.image_alt");
    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
  });

  it("should fallback to the mock image when backend image is missing", () => {
    render(
      <ImmigrationSectionComponent
        data={{
          subtitle: "Subtítulo válido",
          title: "Cidade e memória",
          content: "Conteúdo válido",
        }}
      />,
    );

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
    expect(image).toHaveAttribute("alt", "immigration.image_alt");
  });

  it("should fallback to the mock image when backend image fails to load", () => {
    render(
      <ImmigrationSectionComponent
        data={{
          subtitle: "Subtítulo válido",
          title: "Cidade e memória",
          content: "Conteúdo válido",
          image: {
            src: "/images/quebrada.jpg",
            alt: "Imagem quebrada",
          },
        }}
      />,
    );

    fireEvent.error(screen.getByRole("img"));

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", immigrationMock.image?.src);
    expect(image).toHaveAttribute("alt", "immigration.image_alt");
  });

  it("should not render section when data is null", () => {
    const { container } = render(<ImmigrationSectionComponent data={null} />);

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
