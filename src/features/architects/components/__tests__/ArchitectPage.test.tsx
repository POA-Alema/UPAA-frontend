import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArchitectPage } from "../ArchitectPage";
import { theodorWiederspahnMock } from "../../mocks/architect-mock";

import "@testing-library/jest-dom";

describe("ArchitectPage Component", () => {
  const mockData = theodorWiederspahnMock;

it("should render the architect title and bio from data", () => {
    render(<ArchitectPage architect={mockData} />);

    // 1. Valida o título (H1)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Theodor Wiederspahn/i);

    // 2. Valida a bio ignorando a letra capitular 'T'
    // Buscamos o elemento que contém o corpo do texto. 
    // O 'heodor' garante que pegamos o texto logo após o Drop Cap.
    const bioBody = screen.getByText(/heodor Alexander conhecido como Theo/i);
    expect(bioBody).toBeInTheDocument();
  });

  it("should render the image with correct alt and caption", () => {
    render(<ArchitectPage architect={mockData} />);

    if (mockData.image) {
      const image = screen.getByAltText(mockData.image.alt);
      expect(image).toBeInTheDocument();

      if (mockData.image.caption) {
        expect(screen.getByText(mockData.image.caption)).toBeInTheDocument();
      }
    }
  });

  it("should not render the architect name if title is missing", () => {
    const invalidArchitect = { ...mockData, title: "" };
    render(<ArchitectPage architect={invalidArchitect} />);
    
    const title = screen.getByRole("heading", { level: 1 });
    // O componente renderiza "O Legado de", mas não deve conter o nome
    expect(title.textContent).not.toContain("Theodor Wiederspahn");
  });

  it("should not render history section if bio is missing", () => {
    const noBioArchitect = { ...mockData, bio: "" };
    render(<ArchitectPage architect={noBioArchitect} />);
    
    const historyHeading = screen.queryByText(/História/i);
    expect(historyHeading).not.toBeInTheDocument();
  });
});