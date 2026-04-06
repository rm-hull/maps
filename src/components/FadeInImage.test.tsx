import { vi } from "vitest";
import { render, screen, act, fireEvent } from "../test/utils";
import { FadeInImage } from "./FadeInImage";

// Mock useInView from framer-motion
vi.mock("framer-motion", () => ({
  useInView: vi.fn().mockReturnValue(true),
}));

describe("FadeInImage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should render image with src and alt when in view", () => {
    render(<FadeInImage src="test.jpg" alt="Test Image" />);

    const img = screen.getByAltText("Test Image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test.jpg");
  });

  it("should show spinner while image is loading", () => {
    const { container } = render(<FadeInImage src="test.jpg" alt="Test Image" />);

    // Spinner should be visible before image loads
    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it("should have onload handler for image", () => {
    render(<FadeInImage src="test.jpg" alt="Test Image" />);

    const img = screen.getByAltText("Test Image");

    // Component should have an onload handler
    expect(img.onload).toBeDefined();

    // Trigger load
    fireEvent.load(img);

    // Image should have opacity 1
    expect(img).toHaveStyle({ opacity: "1" });
  });

  it("should retry loading on error", () => {
    render(<FadeInImage src="invalid.jpg" alt="Test Image" />);

    const img = screen.getByAltText("Test Image");

    // Trigger error
    fireEvent.error(img);

    // Should show retrying spinner
    expect(screen.getByText(/Retrying \(1\/3\)\.\.\./)).toBeInTheDocument();

    // Advance timers to trigger retry
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should still have an image (it re-renders with the same src but new key)
    const newImg = screen.getByAltText("Test Image");
    expect(newImg).toBeInTheDocument();
  });

  it("should show error after MAX_RETRIES", () => {
    render(<FadeInImage src="invalid.jpg" alt="Test Image" />);

    const img = screen.getByAltText("Test Image");

    // Trigger error 3 times
    for (let i = 0; i < 3; i++) {
      fireEvent.error(screen.getByAltText("Test Image"));
      act(() => {
        vi.advanceTimersByTime(10000);
      });
    }

    // Trigger 4th error
    fireEvent.error(screen.getByAltText("Test Image"));

    // Should show "Failed to load" message
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("should apply custom height when provided", () => {
    const { container } = render(<FadeInImage src="test.jpg" alt="Test" height={300} />);

    // Just check that the component renders with height prop
    const box = container.firstChild;
    expect(box).toBeInTheDocument();
    expect(box).toHaveStyle({ height: "300px" });
  });

  it("should show empty state icon when no src", () => {
    render(<FadeInImage alt="No image" />);

    // Should show the empty state icon text
    expect(screen.getByText("No image available")).toBeInTheDocument();
  });

  it("should update when props change", () => {
    const { rerender } = render(<FadeInImage src="image1.jpg" alt="Image 1" />);

    const img1 = screen.getByAltText("Image 1");
    expect(img1).toHaveAttribute("src", "image1.jpg");

    rerender(<FadeInImage src="image2.jpg" alt="Image 2" />);

    const img2 = screen.getByAltText("Image 2");
    expect(img2).toHaveAttribute("src", "image2.jpg");
  });
});
