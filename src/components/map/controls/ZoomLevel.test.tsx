import { vi } from "vitest";
import { act, render, screen } from "../../../test/utils";
import { ZoomLevel } from "./ZoomLevel";

type LeafletEvents = {
  zoom?: () => void;
};

// Mock hooks
const mockUseMap = vi.fn<() => { getZoom: () => number }>();
const mockUseMapEvents = vi.fn<(events: LeafletEvents) => void>();

vi.mock("react-leaflet", () => ({
  useMap: (): { getZoom: () => number } => mockUseMap(),
  useMapEvents: (events: LeafletEvents): void => mockUseMapEvents(events),
}));

const mockUseGeneralSettings = vi.fn<() => { settings?: { showZoomLevel: boolean } }>();
vi.mock("../../../hooks/useGeneralSettings", () => ({
  useGeneralSettings: (): { settings?: { showZoomLevel: boolean } } => mockUseGeneralSettings(),
}));

vi.mock("@/components/ui/color-mode", () => ({
  useColorModeValue: vi.fn((light: string) => light),
}));

// Mock Control component
vi.mock("../Control", () => ({
  Control: ({ children }: { children: React.ReactNode }) => <div data-testid="control">{children}</div>,
}));

describe("ZoomLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMap.mockReturnValue({
      getZoom: () => 10,
    });
    mockUseMapEvents.mockReturnValue(undefined);
  });

  it("should render zoom level when showZoomLevel setting is true", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should not render zoom level when showZoomLevel setting is false", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: false },
    });

    render(<ZoomLevel />);

    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  it("should not render zoom level when settings is undefined", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: undefined,
    });

    render(<ZoomLevel />);

    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  it("should render control component", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByTestId("control")).toBeInTheDocument();
  });

  it("should display correct zoom level", () => {
    mockUseMap.mockReturnValue({
      getZoom: () => 15,
    });
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should display .00 for whole-number zoom levels", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(".00")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Zoom level 10.00" })).toBeInTheDocument();
  });

  it("should split fractional zoom levels into integer and decimal parts", () => {
    mockUseMap.mockReturnValue({
      getZoom: () => 13.31,
    });
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText(".31")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Zoom level 13.31" })).toBeInTheDocument();
  });

  it("should register zoom event listener", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(mockUseMapEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        zoom: expect.any(Function) as () => void,
      })
    );
  });

  it("should update zoom level during zoom", () => {
    let zoom = 10;
    let capturedEvents: LeafletEvents | undefined;
    mockUseMap.mockReturnValue({ getZoom: () => zoom });
    mockUseMapEvents.mockImplementation((events: LeafletEvents) => {
      capturedEvents = events;
    });

    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    zoom = 12.5;
    if (capturedEvents?.zoom) {
      act(() => {
        capturedEvents!.zoom!();
      });
    }

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText(".50")).toBeInTheDocument();
  });
});
