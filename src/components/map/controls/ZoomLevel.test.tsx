/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";
import { render, screen } from "../../../test/utils";
import { ZoomLevel } from "./ZoomLevel";

// Mock hooks
const mockUseMap = vi.fn();
const mockUseMapEvents = vi.fn();

vi.mock("react-leaflet", () => ({
  useMap: () => mockUseMap(),
  useMapEvents: (events: any) => mockUseMapEvents(events),
}));

const mockUseGeneralSettings = vi.fn();
vi.mock("../../../hooks/useGeneralSettings", () => ({
  useGeneralSettings: () => mockUseGeneralSettings(),
}));

vi.mock("@/components/ui/color-mode", () => ({
  useColorModeValue: vi.fn((light: string, dark: string) => light),
}));

// Mock Control component
vi.mock("../Control", () => ({
  Control: ({ children }: { children: React.ReactNode }) => <div data-testid="control">{children}</div>,
}));

describe("ZoomLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMap.mockReturnValue({
      getZoom: vi.fn(() => 10),
    });
    mockUseMapEvents.mockReturnValue(null);
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
      getZoom: vi.fn(() => 15),
    });
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should register zoomend event listener", () => {
    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    expect(mockUseMapEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        zoomend: expect.any(Function),
      })
    );
  });

  it("should update zoom level on zoomend event", () => {
    let capturedEvents: any;
    mockUseMapEvents.mockImplementation((events: any) => {
      capturedEvents = events;
      return null;
    });

    const getZoomMock = vi.fn(() => 10);
    mockUseMap.mockReturnValue({
      getZoom: getZoomMock,
    });

    mockUseGeneralSettings.mockReturnValue({
      settings: { showZoomLevel: true },
    });

    render(<ZoomLevel />);

    // Simulate zoom change
    getZoomMock.mockReturnValue(12);
    capturedEvents.zoomend();

    expect(getZoomMock).toHaveBeenCalled();
  });
});
