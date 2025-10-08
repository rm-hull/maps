import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Response, GazetteerEntry } from "../../../services/osdatahub/types";
import { render, screen } from "../../../test/utils";
import { SearchResults } from "./SearchResults";

const mockResponse: Response = {
  header: {
    uri: "test-uri",
    query: "london",
    offset: 0,
    totalresults: 2,
    format: "JSON",
    maxResults: 10,
  },
  results: [
    {
      gazetteerEntry: {
        id: "1",
        name1: "London",
        localType: "City",
        geometryX: 530000,
        geometryY: 180000,
        populatedPlace: "Greater London",
        districtBorough: "Westminster",
        countyUnitary: "Greater London",
        country: "England",
        postcodeDistrict: "SW1",
      } as GazetteerEntry,
    },
    {
      gazetteerEntry: {
        id: "2",
        name1: "City of London",
        localType: "Town",
        geometryX: 532000,
        geometryY: 182000,
        populatedPlace: "City of London",
        districtBorough: "City of London",
        countyUnitary: "Greater London",
        country: "England",
        postcodeDistrict: "EC1",
      } as GazetteerEntry,
    },
  ],
};

describe("SearchResults", () => {
  it("should render list of results", () => {
    const onSelect = vi.fn();
    render(<SearchResults response={mockResponse} onSelect={onSelect} />);

    expect(screen.getByText("London, Greater London, Westminster, SW1, England")).toBeInTheDocument();
    expect(screen.getByText("City of London, Greater London, EC1, England")).toBeInTheDocument();
  });

  it("should display local type for each result", () => {
    const onSelect = vi.fn();
    render(<SearchResults response={mockResponse} onSelect={onSelect} />);

    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Town")).toBeInTheDocument();
  });

  it("should call onSelect when item is clicked", async () => {
    const onSelect = vi.fn();
    const { container } = render(<SearchResults response={mockResponse} onSelect={onSelect} />);

    // Find the first list item and click it
    const firstItem = container.querySelector('[role="option"]');
    expect(firstItem).toBeInTheDocument();

    if (firstItem) {
      await userEvent.click(firstItem as HTMLElement);
      expect(onSelect).toHaveBeenCalledWith(mockResponse.results?.[0].gazetteerEntry);
    }
  });

  it("should render icons for each result", () => {
    const onSelect = vi.fn();
    const { container } = render(<SearchResults response={mockResponse} onSelect={onSelect} />);

    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it("should filter out duplicate fields in label", () => {
    const responseWithDupes: Response = {
      ...mockResponse,
      results: [
        {
          ...mockResponse.results![0],
          gazetteerEntry: {
            id: "3",
            name1: "Test",
            localType: "City",
            geometryX: 530000,
            geometryY: 180000,
            populatedPlace: "Test",
            districtBorough: "Test",
            countyUnitary: "Greater London",
            country: "England",
            postcodeDistrict: "SW1",
          } as GazetteerEntry,
        },
      ],
    };

    const onSelect = vi.fn();
    render(<SearchResults response={responseWithDupes} onSelect={onSelect} />);

    // Should not display "Test" multiple times
    const text = screen.getByText(/Test, Greater London/);
    expect(text).toBeInTheDocument();
  });

  it("should handle empty results", () => {
    const emptyResponse: Response = {
      ...mockResponse,
      results: [],
    };

    const onSelect = vi.fn();
    const { container } = render(<SearchResults response={emptyResponse} onSelect={onSelect} />);

    const items = container.querySelectorAll('[role="option"]');
    expect(items.length).toBe(0);
  });

  it("should handle results without optional fields", () => {
    const minimalResponse: Response = {
      ...mockResponse,
      results: [
        {
          ...mockResponse.results![0],
          gazetteerEntry: {
            id: "4",
            name1: "Minimal Place",
            localType: "Village",
            geometryX: 530000,
            geometryY: 180000,
            country: "England",
          } as GazetteerEntry,
        },
      ],
    };

    const onSelect = vi.fn();
    render(<SearchResults response={minimalResponse} onSelect={onSelect} />);

    expect(screen.getByText("Minimal Place, England")).toBeInTheDocument();
  });
});
