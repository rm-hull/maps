import { render, screen } from "../../../test/utils";
import { GeographAttributionLink } from "./GeographAttributionLink";

describe("GeographAttributionLink", () => {
  it("should render attribution text with photographer name", () => {
    render(<GeographAttributionLink name="John Doe" link="https://example.com/photo" />);

    expect(screen.getByText("CC licensed by")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render link with correct href", () => {
    render(<GeographAttributionLink name="Jane Smith" link="https://example.com/photo" />);

    const link = screen.getByText("Jane Smith");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
    expect(link.closest("a")).toHaveAttribute("rel", "noreferrer");
  });

  it("should add UTM parameters to the link", () => {
    const { container } = render(<GeographAttributionLink name="Test User" link="https://example.com/photo" />);

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

  it("should display date when provided", () => {
    render(<GeographAttributionLink name="John Doe" link="https://example.com/photo" date="2023-01-15" />);

    expect(screen.getByText(", 2023-01-15", { exact: false })).toBeInTheDocument();
  });

  it("should not display date when not provided", () => {
    const { container } = render(<GeographAttributionLink name="John Doe" link="https://example.com/photo" />);

    const text = container.textContent;
    expect(text).not.toContain(",");
  });

  it("should preserve existing query parameters in link", () => {
    const { container } = render(<GeographAttributionLink name="Test" link="https://example.com/photo?id=123" />);

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toContain("id=123");
    expect(link?.getAttribute("href")).toContain("utm_source");
  });
});
