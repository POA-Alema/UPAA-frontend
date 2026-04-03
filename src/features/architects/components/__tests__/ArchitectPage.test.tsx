import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArchitectPage } from "../ArchitectPage";
import { theodorWiederspahnMock } from "../../mocks/architect-mock";

import "@testing-library/jest-dom";

describe("ArchitectPage Component", () => {
  // Using mock data as a data source; the test is unaware of the internal structure to ensure realistic testing
  const mockData = theodorWiederspahnMock;

  it("should render the title and bio dynamically from the architect object", () => {
    render(<ArchitectPage architect={mockData} />);

    // Validates the title by searching for H1 element (independent of text content)
    const titleElement = screen.getByRole("heading", { level: 1 });
    expect(titleElement).toHaveTextContent(mockData.title);

    // Validates the bio using a matcher function to ignore line breaks or spans (Drop Cap)
    // This searches for any element containing the bio text from the object, regardless of formatting
    expect(screen.getByText((content) => content.includes(mockData.bio.substring(1, 20)))).toBeInTheDocument();
  });

  it("should render the image and caption only if they exist in the object", () => {
    render(<ArchitectPage architect={mockData} />);

    if (mockData.image) {
      // Searches for the image by its ALT text from the object
      expect(screen.getByAltText(mockData.image.alt)).toBeInTheDocument();

      if (mockData.image.caption) {
        // Searches for the caption by its text content from the object
        expect(screen.getByText(mockData.image.caption)).toBeInTheDocument();
      }
    }
  });

  it("should not display the architect name in the header if title is empty", () => {
    const emptyData = { ...mockData, title: "" };
    render(<ArchitectPage architect={emptyData} />);
    
    const titleElement = screen.getByRole("heading", { level: 1 });
    // Ensures the original architect name does NOT appear
    expect(titleElement.textContent).not.toContain(mockData.title);
  });

  it("should hide the history section heading if bio is missing", () => {
    const noBioData = { ...mockData, bio: "" };
    render(<ArchitectPage architect={noBioData} />);
    
    // Searches for the "História" heading and ensures it is not present
    const historyHeading = screen.queryByRole("heading", { name: /História/i });
    expect(historyHeading).not.toBeInTheDocument();
  });
});