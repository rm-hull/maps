import { vi } from "vitest";
import { render, screen } from "../test/utils";
import { Search } from "./Search";

// Mock useParams
const mockUseParams = vi.fn<() => { query?: string }>();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: (): { query?: string } => mockUseParams(),
  };
});

// Mock useFind hook
interface FindResult {
  data?: {
    header?: { totalresults: number };
    results?: Array<{ gazetteerEntry: { geometryX: number; geometryY: number } }> | null;
  };
  isLoading: boolean;
  error: Error | null;
}
const mockUseFind = vi.fn<(query: string, limit: number) => FindResult>();
vi.mock("../hooks/useFind", () => ({
  useFind: (query: string, limit: number): FindResult => mockUseFind(query, limit),
}));

// Mock Home component
vi.mock("./Home", () => ({
  Home: ({ latLng }: { latLng?: { lat: number; lng: number } }) => (
    <div data-testid="home">Home with latLng: {latLng ? `${latLng.lat}, ${latLng.lng}` : "none"}</div>
  ),
}));

// Mock toLatLng
vi.mock("../services/osdatahub/helpers", () => ({
  toLatLng: (coords: [number, number]) => ({
    lat: coords[1] / 1000,
    lng: coords[0] / 1000,
  }),
}));

describe("Search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state when data is loading", () => {
    mockUseParams.mockReturnValue({ query: "london" });
    mockUseFind.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Search />);

    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });

  it("should show loading state when data is undefined", () => {
    mockUseParams.mockReturnValue({ query: "london" });
    mockUseFind.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<Search />);

    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });

  it("should show no results message when no results found", () => {
    mockUseParams.mockReturnValue({ query: "nonexistent" });
    mockUseFind.mockReturnValue({
      data: {
        header: { totalresults: 0 },
        results: [],
      },
      isLoading: false,
      error: null,
    });

    render(<Search />);

    expect(screen.getByText(/no results for: nonexistent/i)).toBeInTheDocument();
  });

  it("should show no results message when results array is empty", () => {
    mockUseParams.mockReturnValue({ query: "test" });
    mockUseFind.mockReturnValue({
      data: {
        header: { totalresults: 0 },
        results: null,
      },
      isLoading: false,
      error: null,
    });

    render(<Search />);

    expect(screen.getByText(/no results for: test/i)).toBeInTheDocument();
  });

  it("should render Home component with latLng when results found", () => {
    mockUseParams.mockReturnValue({ query: "london" });
    mockUseFind.mockReturnValue({
      data: {
        header: { totalresults: 1 },
        results: [
          {
            gazetteerEntry: {
              geometryX: 530047,
              geometryY: 180381,
            },
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<Search />);

    expect(screen.getByTestId("home")).toBeInTheDocument();
    expect(screen.getByTestId("home")).toHaveTextContent("180.381, 530.047");
  });

  it("should throw error when error is present", () => {
    mockUseParams.mockReturnValue({ query: "london" });
    mockUseFind.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API Error"),
    });

    // Expect the component to throw
    expect(() => render(<Search />)).toThrow("API Error");
  });

  it("should use default query when query param is undefined", () => {
    mockUseParams.mockReturnValue({ query: undefined });
    mockUseFind.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Search />);

    expect(mockUseFind).toHaveBeenCalledWith("bloerew", 10);
  });

  it("should call useFind with query and limit of 10", () => {
    mockUseParams.mockReturnValue({ query: "edinburgh" });
    mockUseFind.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Search />);

    expect(mockUseFind).toHaveBeenCalledWith("edinburgh", 10);
  });
});
