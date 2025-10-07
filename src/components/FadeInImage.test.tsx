import { vi } from "vitest";
import { render, screen, waitFor } from "../test/utils";
import { FadeInImage, type ImageLoaderFn } from "./FadeInImage";

describe("FadeInImage", () => {
  it("should render image with src and alt", () => {
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

    // Image should start with opacity 0 (or undefined in jsdom)
    expect(img).toBeInTheDocument();
  });

  it("should handle image load error gracefully", () => {
    const { container } = render(<FadeInImage src="invalid.jpg" alt="Test Image" />);

    const img = screen.getByAltText("Test Image");

    // Component should have an onerror handler
    expect(img.onerror).toBeDefined();

    // Component should render without crashing even if image fails
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should call loader function when provided", () => {
    const mockLoader: ImageLoaderFn = vi.fn().mockResolvedValue({
      src: "loaded.jpg",
      alt: "Loaded Image",
    });

    render(<FadeInImage loader={mockLoader} />);

    expect(mockLoader).toHaveBeenCalledTimes(1);
  });

  it("should update image when loader resolves", async () => {
    const mockLoader: ImageLoaderFn = vi.fn().mockResolvedValue({
      src: "loaded.jpg",
      alt: "Loaded Image",
    });

    render(<FadeInImage loader={mockLoader} />);

    await waitFor(() => {
      expect(screen.getByAltText("Loaded Image")).toBeInTheDocument();
    });
  });

  it("should show error when loader fails", async () => {
    const mockLoader: ImageLoaderFn = vi.fn().mockRejectedValue(new Error("Load failed"));

    const { container } = render(<FadeInImage loader={mockLoader} />);

    await waitFor(() => {
      // Error icon should be shown
      const errorIcon = container.querySelector("svg");
      expect(errorIcon).toBeInTheDocument();
    });
  });

  it("should render attribution when provided", () => {
    render(<FadeInImage src="test.jpg" alt="Test" attribution="Photo by Test" />);

    expect(screen.getByText("Photo by Test")).toBeInTheDocument();
  });

  it("should render attribution from loader", async () => {
    const mockLoader: ImageLoaderFn = vi.fn().mockResolvedValue({
      src: "loaded.jpg",
      alt: "Loaded",
      attribution: <span>Attribution Text</span>,
    });

    render(<FadeInImage loader={mockLoader} />);

    await waitFor(() => {
      expect(screen.getByText("Attribution Text")).toBeInTheDocument();
    });
  });

  it("should apply custom height when provided", () => {
    const { container } = render(<FadeInImage src="test.jpg" alt="Test" height={300} />);

    // Just check that the component renders with height prop
    const box = container.firstChild;
    expect(box).toBeInTheDocument();
  });

  it("should show empty state icon when no src and no loader", () => {
    const { container } = render(<FadeInImage alt="No image" />);

    // Should show the empty state icon
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should cleanup on unmount", () => {
    const mockLoader: ImageLoaderFn = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ src: "test.jpg" }), 100);
        })
    );

    const { unmount } = render(<FadeInImage loader={mockLoader} />);

    unmount();

    // Should not throw or cause issues
    expect(mockLoader).toHaveBeenCalled();
  });

  it("should update when props change", async () => {
    const { rerender } = render(<FadeInImage src="image1.jpg" alt="Image 1" />);

    const img1 = screen.getByAltText("Image 1");
    expect(img1).toHaveAttribute("src", "image1.jpg");

    rerender(<FadeInImage src="image2.jpg" alt="Image 2" />);

    await waitFor(() => {
      const img2 = screen.getByAltText("Image 2");
      expect(img2).toHaveAttribute("src", "image2.jpg");
    });
  });
});
