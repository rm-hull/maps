/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLng } from "leaflet";
import { vi } from "vitest";
import { render, screen } from "../../test/utils";
import { NearestInfo } from "./NearestInfo";

// Mock hooks
const mockUseNearest = vi.fn();
vi.mock("../../hooks/useNearest", () => ({
  useNearest: vi.fn((bng: [number, number]) => mockUseNearest(bng)),
}));

vi.mock("@/hooks/useErrorToast", () => ({
  useErrorToast: vi.fn(),
}));

// Mock toBNG helper
vi.mock("../../services/osdatahub/helpers", () => ({
  toBNG: vi.fn((latLng: LatLng) => [530000, 180000]),
}));

describe("NearestInfo", () => {
  const mockRender = vi.fn((children, position) => (
    <div data-testid="rendered-popup">
      <div data-testid="popup-position">
        {position.lat},{position.lng}
      </div>
      {children}
    </div>
  ));

  const testLatLng = new LatLng(51.5, -0.1);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when data is undefined", () => {
    mockUseNearest.mockReturnValue({
      data: undefined,
      status: "loading",
      error: null,
    });

    const { container } = render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render nothing when status is not success", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 1 } },
      status: "loading",
      error: null,
    });

    const { container } = render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render GPS info when no results found", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 }, results: [] },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.getByText("Easting")).toBeInTheDocument();
    expect(screen.getByText("Northing")).toBeInTheDocument();
    expect(screen.getByText("Latitude")).toBeInTheDocument();
    expect(screen.getByText("Longitude")).toBeInTheDocument();
  });

  it("should render GPS coordinates correctly", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 }, results: [] },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.getByText("51.5000000 N")).toBeInTheDocument();
    expect(screen.getByText("-0.1000000 E")).toBeInTheDocument();
  });

  it("should render nearest location info when results found", () => {
    mockUseNearest.mockReturnValue({
      data: {
        header: { totalresults: 1 },
        results: [
          {
            gazetteerEntry: {
              localType: "City",
              name1: "London",
              countyUnitary: "Greater London",
              districtBorough: "Westminster",
              region: "London",
            },
          },
        ],
      },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("District")).toBeInTheDocument();
    expect(screen.getByText("Westminster")).toBeInTheDocument();
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Greater London")).toBeInTheDocument();
  });

  it("should render GPS info along with location info", () => {
    mockUseNearest.mockReturnValue({
      data: {
        header: { totalresults: 1 },
        results: [
          {
            gazetteerEntry: {
              localType: "Town",
              name1: "Test Town",
              countyUnitary: "Test County",
            },
          },
        ],
      },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.getByText("Test Town")).toBeInTheDocument();
    expect(screen.getByText("Latitude")).toBeInTheDocument();
    expect(screen.getByText("Longitude")).toBeInTheDocument();
  });

  it("should render altitude when provided", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 } },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} altitude={123.5} render={mockRender} />);

    expect(screen.getByText("Altitude")).toBeInTheDocument();
    expect(screen.getByText("123.5 m")).toBeInTheDocument();
  });

  it("should render heading when provided", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 } },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} heading={180} render={mockRender} />);

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("180°")).toBeInTheDocument();
  });

  it("should render GPS accuracy when provided", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 } },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} accuracy={15.7} render={mockRender} />);

    expect(screen.getByText("GPS Accuracy")).toBeInTheDocument();
    expect(screen.getByText("16 m")).toBeInTheDocument();
  });

  it("should render timestamp when provided", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 } },
      status: "success",
      error: null,
    });

    const timestamp = new Date("2023-01-15T12:34:56.789Z").getTime();
    render(<NearestInfo latLng={testLatLng} timestamp={timestamp} render={mockRender} />);

    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("12:34:56")).toBeInTheDocument();
  });

  it("should use region when countyUnitary is not available", () => {
    mockUseNearest.mockReturnValue({
      data: {
        header: { totalresults: 1 },
        results: [
          {
            gazetteerEntry: {
              localType: "Village",
              name1: "Test Village",
              region: "Test Region",
            },
          },
        ],
      },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Test Region")).toBeInTheDocument();
  });

  it("should not render district row when districtBorough is undefined", () => {
    mockUseNearest.mockReturnValue({
      data: {
        header: { totalresults: 1 },
        results: [
          {
            gazetteerEntry: {
              localType: "Village",
              name1: "Test Village",
              countyUnitary: "Test County",
            },
          },
        ],
      },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(screen.queryByText("District")).not.toBeInTheDocument();
  });

  it("should call render function with correct parameters", () => {
    mockUseNearest.mockReturnValue({
      data: { header: { totalresults: 0 } },
      status: "success",
      error: null,
    });

    render(<NearestInfo latLng={testLatLng} render={mockRender} />);

    expect(mockRender).toHaveBeenCalledWith(expect.anything(), testLatLng);
  });
});
