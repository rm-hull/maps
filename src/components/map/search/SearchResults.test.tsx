 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";
import type { Response } from "../../../services/osdatahub/types";
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
        uprn: "123",
        address: "Test Address 1",
        building_number: "1",
        thoroughfare_name: "Test Street",
        post_town: "London",
        postcode: "SW1A 1AA",
        rpc: "1",
        x_coordinate: 530000,
        y_coordinate: 180000,
        status: "approved",
        logical_status_code: "1",
        classification_code: "RD",
        classification_code_description: "Dwelling",
        local_custodian_code: 5900,
        local_custodian_code_description: "CITY OF WESTMINSTER",
        country: "England",
        country_code: "E",
        postal_address_code: "D",
        postal_address_code_description: "A record which is linked to PAF",
        blpu_state_code: "2",
        blpu_state_code_description: "In use",
        topography_layer_toid: "osgb1000000000000001",
        parent_uprn: "456",
        last_update_date: "10/02/2016",
        entry_date: "19/03/2001",
        legal_name: "Test Legal Name",
        blpu_state_date: "01/01/2000",
        language: "EN",
        match: 1.0,
        match_description: "EXACT",
        delivery_point_suffix: "1A",
      },
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
      } as any,
    },
    {
      gazetteerEntry: {
        uprn: "789",
        address: "Test Address 2",
        building_number: "2",
        thoroughfare_name: "Another Street",
        post_town: "London",
        postcode: "EC1A 1AA",
        rpc: "1",
        x_coordinate: 532000,
        y_coordinate: 182000,
        status: "approved",
        logical_status_code: "1",
        classification_code: "RD",
        classification_code_description: "Dwelling",
        local_custodian_code: 5900,
        local_custodian_code_description: "CITY OF WESTMINSTER",
        country: "England",
        country_code: "E",
        postal_address_code: "D",
        postal_address_code_description: "A record which is linked to PAF",
        blpu_state_code: "2",
        blpu_state_code_description: "In use",
        topography_layer_toid: "osgb1000000000000002",
        parent_uprn: "457",
        last_update_date: "10/02/2016",
        entry_date: "19/03/2001",
        legal_name: "Test Legal Name 2",
        blpu_state_date: "01/01/2000",
        language: "EN",
        match: 1.0,
        match_description: "EXACT",
        delivery_point_suffix: "1B",
      },
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
      } as any,
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

  it("should call onSelect when item is clicked", () => {
    const onSelect = vi.fn();
    const { container } = render(<SearchResults response={mockResponse} onSelect={onSelect} />);

    // Find the first list item and click it
    const firstItem = container.querySelector('[role="option"]');
    expect(firstItem).toBeInTheDocument();

    if (firstItem) {
      (firstItem as HTMLElement).click();
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
          } as any,
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
          } as any,
        },
      ],
    };

    const onSelect = vi.fn();
    render(<SearchResults response={minimalResponse} onSelect={onSelect} />);

    expect(screen.getByText("Minimal Place, England")).toBeInTheDocument();
  });
});
