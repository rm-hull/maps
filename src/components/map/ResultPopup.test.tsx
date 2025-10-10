import { vi } from "vitest";
import { render, screen } from "../../test/utils";
import { ResultPopup } from "./ResultPopup";

// Mock FadeInImage
vi.mock("../FadeInImage", () => ({
  FadeInImage: ({ alt, attribution }: { alt: string; attribution?: React.ReactNode }) => (
    <div data-testid="fade-in-image">
      Image: {alt}
      {attribution && <div data-testid="image-attribution">{attribution}</div>}
    </div>
  ),
}));

// Mock react-leaflet Popup
vi.mock("react-leaflet", () => ({
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
}));

describe("ResultPopup", () => {
  it("should render title and description", () => {
    render(<ResultPopup title="Test Place" description="A beautiful location" />);

    expect(screen.getByText("Test Place")).toBeInTheDocument();
    expect(screen.getByText("A beautiful location")).toBeInTheDocument();
  });

  it("should render image when imageUrl is provided", () => {
    render(<ResultPopup title="Test" description="Desc" imageUrl="https://example.com/image.jpg" />);

    const image = screen.getByTestId("fade-in-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveTextContent("Image: Test");
  });

  it("should render image when imageLoader is provided", () => {
    const mockLoader = vi.fn();
    render(<ResultPopup title="Test" description="Desc" imageLoader={mockLoader} />);

    expect(screen.getByTestId("fade-in-image")).toBeInTheDocument();
  });

  it("should not render image when neither imageUrl nor imageLoader provided", () => {
    render(<ResultPopup title="Test" description="Desc" />);

    expect(screen.queryByTestId("fade-in-image")).not.toBeInTheDocument();
  });

  it("should render distance badge when distanceKm is provided", () => {
    render(<ResultPopup title="Test" description="Desc" distanceKm={5.2} />);

    expect(screen.getByText("5.2 km")).toBeInTheDocument();
  });

  it("should not render distance badge when distanceKm is not provided", () => {
    render(<ResultPopup title="Test" description="Desc" />);

    expect(screen.queryByText(/km$/)).not.toBeInTheDocument();
  });

  it("should render attribution when provided", () => {
    const attribution = <div>Photo by John Doe</div>;
    render(<ResultPopup title="Test" description="Desc" imageUrl="test.jpg" attribution={attribution} />);

    expect(screen.getByTestId("image-attribution")).toBeInTheDocument();
    expect(screen.getByText("Photo by John Doe")).toBeInTheDocument();
  });

  it("should render chips when provided", () => {
    const chips = ["restaurant", "outdoor_seating", "wifi"];
    render(<ResultPopup title="Test" description="Desc" chips={chips} />);

    expect(screen.getByText("RESTAURANT")).toBeInTheDocument();
    expect(screen.getByText("OUTDOOR SEATING")).toBeInTheDocument();
    expect(screen.getByText("WIFI")).toBeInTheDocument();
  });

  it("should replace underscores with spaces in chips", () => {
    const chips = ["free_parking"];
    render(<ResultPopup title="Test" description="Desc" chips={chips} />);

    expect(screen.getByText("FREE PARKING")).toBeInTheDocument();
  });

  it("should render as a link when targetUrl is provided", () => {
    const { container } = render(<ResultPopup title="Test" description="Desc" targetUrl="https://example.com" />);

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("should not render as a link when targetUrl is not provided", () => {
    const { container } = render(<ResultPopup title="Test" description="Desc" />);

    const link = container.querySelector("a");
    expect(link).not.toBeInTheDocument();
  });

  it("should render complete card with all props", () => {
    const chips = ["tag1", "tag2"];
    const attribution = <div>Attribution text</div>;

    render(
      <ResultPopup
        title="Complete Card"
        description="Full description"
        imageUrl="test.jpg"
        targetUrl="https://example.com"
        distanceKm={10}
        attribution={attribution}
        chips={chips}
      />
    );

    expect(screen.getByText("Complete Card")).toBeInTheDocument();
    expect(screen.getByText("Full description")).toBeInTheDocument();
    expect(screen.getByTestId("fade-in-image")).toBeInTheDocument();
    expect(screen.getByText("10 km")).toBeInTheDocument();
    expect(screen.getByText("TAG1")).toBeInTheDocument();
    expect(screen.getByText("TAG2")).toBeInTheDocument();
  });
});
