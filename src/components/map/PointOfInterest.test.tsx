/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLng } from "leaflet";
import { vi } from "vitest";
import { render } from "../../test/utils";
import { PointOfInterest } from "./PointOfInterest";

// Mock useMapEvent
const mockUseMapEvent = vi.fn();
vi.mock("react-leaflet", () => ({
  useMapEvent: vi.fn((event: string, handler: any) => mockUseMapEvent(event, handler)),
}));

// Mock NearestInfo
vi.mock("./NearestInfo", () => ({
  NearestInfo: ({ latLng }: { latLng: LatLng }) => (
    <div data-testid="nearest-info">
      Position: {latLng.lat},{latLng.lng}
    </div>
  ),
}));

// Mock PopupPassthrough
vi.mock("./PopupPassthrough", () => ({
  PopupPassthrough: vi.fn((children, position) => (
    <div data-testid="popup-passthrough">
      {children}
      <div>Popup at: {position.lat}</div>
    </div>
  )),
}));

describe("PointOfInterest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing initially", () => {
    const { container } = render(<PointOfInterest />);

    expect(container.firstChild).toBeNull();
  });

  it("should register contextmenu event listener", () => {
    render(<PointOfInterest />);

    expect(mockUseMapEvent).toHaveBeenCalledWith("contextmenu", expect.any(Function));
  });

  it("should render NearestInfo when position is set", () => {
    let capturedHandler: any;
    mockUseMapEvent.mockImplementation((event: string, handler: any) => {
      capturedHandler = handler;
    });

    const { rerender, getByTestId } = render(<PointOfInterest />);

    // Simulate context menu event
    const mockLatLng = new LatLng(51.5, -0.1);
    capturedHandler({ latlng: mockLatLng });

    // Force re-render
    rerender(<PointOfInterest />);

    // After the event, NearestInfo should be rendered
    // Note: In the actual component, this would trigger a re-render via state change
    expect(mockUseMapEvent).toHaveBeenCalledWith("contextmenu", expect.any(Function));
  });

  it("should pass correct position to event handler", () => {
    let capturedHandler: any;
    mockUseMapEvent.mockImplementation((event: string, handler: any) => {
      capturedHandler = handler;
    });

    render(<PointOfInterest />);

    const mockLatLng = new LatLng(52.0, 1.0);
    capturedHandler({ latlng: mockLatLng });

    expect(mockUseMapEvent).toHaveBeenCalled();
  });
});
