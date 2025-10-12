import { render, screen } from "../../../test/utils";
import { UnsplashAttributionLink } from "./UnsplashAttributionLink";

describe("UnsplashAttributionLink", () => {
  it("should render attribution text with photographer name", () => {
    render(<UnsplashAttributionLink name="John Doe" link="https://unsplash.com/@johndoe" />);

    expect(screen.getByText(/Photo by/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Unsplash/i)).toBeInTheDocument();
  });

  it("should render link with correct href", () => {
    render(<UnsplashAttributionLink name="Jane Smith" link="https://unsplash.com/@janesmith" />);

    const link = screen.getByText("Jane Smith");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
    expect(link.closest("a")).toHaveAttribute("rel", "noreferrer");
  });

  it("should add UTM parameters to the link", () => {
    const { container } = render(<UnsplashAttributionLink name="Test User" link="https://unsplash.com/@testuser" />);

    const link = container.querySelector('a[href*="utm_source"]');
    expect(link).toBeInTheDocument();
    const href = link?.getAttribute("href");
    expect(href).toContain("utm_source");
    expect(href).toContain("utm_medium");
    // Check decoded URL contains the values
    const decodedHref = decodeURIComponent(href || "");
    expect(decodedHref).toContain("https://www.destructuring-bind.org/maps");
    expect(decodedHref).toContain("referral");
  });

  it("should preserve existing query parameters in link", () => {
    const { container } = render(<UnsplashAttributionLink name="Test" link="https://unsplash.com/@test?ref=123" />);

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toContain("ref=123");
    expect(link?.getAttribute("href")).toContain("utm_source");
  });

  it("should render complete attribution message", () => {
    const { container } = render(<UnsplashAttributionLink name="Photographer" link="https://unsplash.com/@photo" />);

    const text = container.textContent;
    expect(text).toContain("Photo by");
    expect(text).toContain("Photographer");
    expect(text).toContain("(Unsplash)");
  });
});
