import type { ComponentPropsWithoutRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ImmigrationSectionComponent } from "../immigration-section";
import type { ImmigrationSection } from "../../types/immigration";

const immigrationData: ImmigrationSection = {
  subtitle: "Cidade e memoria",
  title: "Imigracao",
  content: "<p>Conteudo vindo do backend.</p>",
  image: {
    src: "/images/backend.jpg",
    alt: "Imagem vinda do backend",
  },
};

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
    render(<ImmigrationSectionComponent data={immigrationData} />);

    expect(screen.getByText("immigration.eyebrow")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "immigration.title",
    );
    expect(screen.getByTestId("immigration-content")).toHaveTextContent(
      "immigration.content",
    );
  });

  it("should render image when present", () => {
    render(<ImmigrationSectionComponent data={immigrationData} />);

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "immigration.image_alt");
    expect(image).toHaveAttribute("src", immigrationData.image?.src);
  });

  it("should not render an image when backend image is missing", () => {
    render(
      <ImmigrationSectionComponent
        data={{
          subtitle: "Subtítulo válido",
          title: "Cidade e memória",
          content: "Conteúdo válido",
        }}
      />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should hide the image when backend image fails to load", () => {
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

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should not render section when data is null", () => {
    const { container } = render(<ImmigrationSectionComponent data={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render content with proper formatting", () => {
    render(<ImmigrationSectionComponent data={immigrationData} />);

    const contentElement = screen.getByTestId("immigration-content");
    const paragraphs = contentElement.querySelectorAll("p");

    expect(contentElement).toBeInTheDocument();
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it("should emphasize first paragraph", () => {
    render(<ImmigrationSectionComponent data={immigrationData} />);

    const firstParagraph = screen
      .getByTestId("immigration-content")
      .querySelector(".rich-text__paragraph--lead");

    expect(firstParagraph).toBeInTheDocument();
  });
});
