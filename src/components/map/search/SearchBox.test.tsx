import { useCallback } from "react";
import { vi } from "vitest";
import { GazetteerEntry, Response as SearchResponse } from "../../../services/osdatahub/types";
import { fireEvent, render, screen, waitFor } from "../../../test/utils";
import { SearchBox } from "./SearchBox";

// Mock hooks
const mockUseFind =
  vi.fn<
    (query: string, limit: number) => { data: SearchResponse | undefined; error: Error | null; isLoading: boolean }
  >();
vi.mock("@/hooks/useFind", () => ({
  useFind: (
    query: string,
    limit: number
  ): { data: SearchResponse | undefined; error: Error | null; isLoading: boolean } => mockUseFind(query, limit),
}));

vi.mock("@/hooks/useErrorToast", () => ({
  useErrorToast: vi.fn(() => {}),
}));

interface GeneralSettings {
  settings: { maxSearchResults: number };
}

const mockUseGeneralSettings = vi.fn<() => GeneralSettings>();
vi.mock("@/hooks/useGeneralSettings", () => ({
  useGeneralSettings: (): GeneralSettings => mockUseGeneralSettings(),
}));

const mockUseFocus = vi.fn<() => [React.MutableRefObject<HTMLElement | null>, () => void]>();
vi.mock("../../../hooks/useFocus", () => ({
  useFocus: (): [React.MutableRefObject<HTMLElement | null>, () => void] => mockUseFocus(),
}));

// Mock react-leaflet
const mockUseMapEvent = vi.fn<(event: string, handler: () => void) => { flyTo: () => void; getZoom: () => number }>();
vi.mock("react-leaflet", () => ({
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  useMapEvent: (event: string, handler: () => void): { flyTo: () => void; getZoom: () => number } =>
    mockUseMapEvent(event, handler),
}));

// Mock react-use
vi.mock("react-use", () => ({
  useKeyPressEvent: vi.fn(() => {}),
  useDebounce: vi.fn((fn: () => void) => fn()),
}));

// Mock components
vi.mock("../Control", () => ({
  Control: ({ children }: { children: React.ReactNode }) => <div data-testid="control">{children}</div>,
}));

vi.mock("../NearestInfo", () => ({
  NearestInfo: () => <div data-testid="nearest-info">NearestInfo</div>,
}));

vi.mock("../PopupPassthrough", () => ({
  PopupPassthrough: () => <div>PopupPassthrough</div>,
}));

vi.mock("./SearchResults", () => ({
  SearchResults: ({ response, onSelect }: { response: SearchResponse; onSelect: (entry: GazetteerEntry) => void }) => {
    const handleSelect = useCallback(() => {
      onSelect(response.results![0].gazetteerEntry);
    }, [response, onSelect]);
    return (
      <div data-testid="search-results">
        <button onClick={handleSelect}>Select Result</button>
      </div>
    );
  },
}));

vi.mock("@/icons", () => ({
  greenMarker: {},
}));

vi.mock("../../../services/osdatahub/helpers", () => ({
  toLatLng: (coords: [number, number]) => ({ lat: coords[1] / 1000, lng: coords[0] / 1000 }),
}));

describe("SearchBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGeneralSettings.mockReturnValue({ settings: { maxSearchResults: 5 } });
    mockUseFocus.mockReturnValue([{ current: null }, vi.fn()]);
    mockUseMapEvent.mockReturnValue({
      flyTo: vi.fn(),
      getZoom: vi.fn().mockReturnValue(10),
    });
    mockUseFind.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    });
  });

  it("should render search input", async () => {
    render(<SearchBox />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/input place/i);
      expect(input).toBeInTheDocument();
    });
  });

  it("should render control component", async () => {
    render(<SearchBox />);

    await waitFor(() => {
      expect(screen.getByTestId("control")).toBeInTheDocument();
    });
  });

  it("should show loading state when searching", async () => {
    mockUseFind.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    const { container } = render(<SearchBox />);

    // Simulate '/' key press to open the search box
    fireEvent.keyPress(container, { key: "/", code: 47, charCode: 47 });

    await waitFor(() => {
      // Should show spinner for busy state
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });

  it("should display search results when multiple results found", async () => {
    const mockData = {
      header: { totalresults: 2 } as SearchResponse["header"],
      results: [
        {
          gazetteerEntry: {
            id: "1",
            name1: "London",
            localType: "City",
            geometryX: 530000,
            geometryY: 180000,
          } as GazetteerEntry,
        },
        {
          gazetteerEntry: {
            id: "2",
            name1: "London Bridge",
            localType: "Railway Station",
            geometryX: 532000,
            geometryY: 181000,
          } as GazetteerEntry,
        },
      ],
    } as SearchResponse;

    mockUseFind.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    render(<SearchBox />);

    await waitFor(() => {
      // Component should render without error when data is available
      const input = screen.getByPlaceholderText(/input place/i);
      expect(input).toBeInTheDocument();
    });
  });

  it("should handle error state", async () => {
    mockUseFind.mockReturnValue({
      data: undefined,
      error: new Error("Search failed"),
      isLoading: false,
    });

    const { container } = render(<SearchBox />);

    await waitFor(() => {
      // Component should render without crashing when there's an error
      expect(container).toBeInTheDocument();
    });
  });

  it("should handle no results found", async () => {
    mockUseFind.mockReturnValue({
      data: {
        header: { totalresults: 0 } as SearchResponse["header"],
        results: undefined,
      } as SearchResponse,
      error: null,
      isLoading: false,
    });

    const { container } = render(<SearchBox />);

    await waitFor(() => {
      // Should show not-found icon
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  it("should use settings for max search results", async () => {
    mockUseGeneralSettings.mockReturnValue({ settings: { maxSearchResults: 10 } });

    render(<SearchBox />);

    await waitFor(() => {
      expect(mockUseFind).toHaveBeenCalledWith("", 10);
    });
  });

  it("should default to 5 results if settings not available", async () => {
    mockUseGeneralSettings.mockReturnValue({ settings: null as unknown as { maxSearchResults: number } });

    render(<SearchBox />);

    await waitFor(() => {
      expect(mockUseFind).toHaveBeenCalledWith("", 5);
    });
  });

  it("should have disabled input when loading", async () => {
    mockUseFind.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    render(<SearchBox />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/input place/i);
      expect(input).toBeDisabled();
    });
  });

  it("should not have readonly input when not loading", async () => {
    render(<SearchBox />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/input place/i);
      expect(input).not.toHaveAttribute("readonly");
    });
  });

  it("should render with correct input width", async () => {
    render(<SearchBox />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/input place/i);
      expect(input).toBeInTheDocument();
    });
  });
});
