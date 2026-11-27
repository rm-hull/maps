import { act, render, screen } from "../../../test/utils";
import { Coordinates } from "./Coordinates";

type LatLng = { lat: number; lng: number };
type LeafletEvents = {
  mousemove?: (event: { latlng: LatLng }) => void;
};

const mockUseMap = vi.fn<() => { getCenter: () => LatLng }>();
const mockUseMapEvents = vi.fn<(events: LeafletEvents) => void>();

vi.mock("react-leaflet", () => ({
  useMap: (): { getCenter: () => LatLng } => mockUseMap(),
  useMapEvents: (events: LeafletEvents): void => mockUseMapEvents(events),
}));

vi.mock("../Control", () => ({
  Control: ({
    children,
    position,
    prepend,
  }: {
    children: React.ReactNode;
    position: string;
    prepend: boolean;
  }) => (
    <div data-testid="control" data-position={position} data-prepend={prepend}>
      {children}
    </div>
  ),
}));

describe("Coordinates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMap.mockReturnValue({ getCenter: () => ({ lat: 51.5, lng: -0.125 }) });
    mockUseMapEvents.mockReturnValue(undefined);
  });

  it("shows degrees and decimal minutes for the map center by default", () => {
    render(<Coordinates position="bottomright" />);

    expect(screen.getByText("Lat: 51° 30.000′ N")).toBeInTheDocument();
    expect(screen.getByText("Lng: 0° 7.500′ W")).toBeInTheDocument();
  });

  it("shows degrees and decimal minutes when requested", () => {
    render(<Coordinates format="minutes" position="bottomright" />);

    expect(screen.getByText("Lat: 51° 30.000′ N")).toBeInTheDocument();
    expect(screen.getByText("Lng: 0° 7.500′ W")).toBeInTheDocument();
  });

  it("updates coordinates when the pointer moves over the map", () => {
    let capturedEvents: LeafletEvents | undefined;
    mockUseMapEvents.mockImplementation((events) => {
      capturedEvents = events;
    });

    render(<Coordinates position="bottomright" />);

    act(() => {
      capturedEvents?.mousemove?.({ latlng: { lat: -33.8568, lng: 151.2153 } });
    });

    expect(screen.getByText("Lat: 33° 51.408′ S")).toBeInTheDocument();
    expect(screen.getByText("Lng: 151° 12.918′ E")).toBeInTheDocument();
  });

  it("forwards the supplied position to the prepended control", () => {
    render(<Coordinates position="topleft" />);

    expect(screen.getByTestId("control")).toHaveAttribute("data-position", "topleft");
    expect(screen.getByTestId("control")).toHaveAttribute("data-prepend", "true");
  });
});