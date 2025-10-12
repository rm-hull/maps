import { LatLng } from "leaflet";
import { vi } from "vitest";
import { render } from "../../test/utils";
import { PointOfInterest } from "./PointOfInterest";

const { mockUseMapEvent } = vi.hoisted(() => {
  return {
    mockUseMapEvent: vi.fn<(eventType: string, handler: (event: { latlng: LatLng }) => void) => void>(),
  };
});

// Mock useMapEvent
vi.mock("react-leaflet", () => ({
  useMapEvent: mockUseMapEvent,
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
  PopupPassthrough: vi.fn((children, position: LatLng) => (
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
});
