import { LatLng } from "leaflet";
import { vi } from "vitest";
import { render } from "../test/utils";
import { Home } from "./Home";

// Mock the OSMap component
vi.mock("../components/map/OSMap", () => ({
  OSMap: ({ center }: { center?: LatLng }) => (
    <div data-testid="os-map">{center ? `Map centered at: ${center.lat}, ${center.lng}` : "Map with no center"}</div>
  ),
}));

describe("Home", () => {
  it("should render OSMap without center when no latLng provided", () => {
    const { getByTestId } = render(<Home />);

    expect(getByTestId("os-map")).toBeInTheDocument();
    expect(getByTestId("os-map")).toHaveTextContent("Map with no center");
  });

  it("should render OSMap with center when latLng provided", () => {
    const latLng = new LatLng(51.5074, -0.1278);
    const { getByTestId } = render(<Home latLng={latLng} />);

    expect(getByTestId("os-map")).toBeInTheDocument();
    expect(getByTestId("os-map")).toHaveTextContent("Map centered at: 51.5074, -0.1278");
  });

  it("should pass latLng prop to OSMap", () => {
    const latLng = new LatLng(55.9533, -3.1883); // Edinburgh
    const { getByTestId } = render(<Home latLng={latLng} />);

    expect(getByTestId("os-map")).toHaveTextContent("55.9533");
    expect(getByTestId("os-map")).toHaveTextContent("-3.1883");
  });
});
