import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import { BearingIndicator } from "./BearingIndicator";
import { ReactNode } from "react";

// Mock Tooltip from react-leaflet
vi.mock("react-leaflet", () => ({
  Tooltip: ({ children, className }: { children: ReactNode; className: string }) => (
    <div data-testid="leaflet-tooltip" className={className}>
      {children}
    </div>
  ),
}));

describe("BearingIndicator", () => {
  it("should render children even if bearing is invalid", () => {
    render(
      <BearingIndicator bearing="INVALID">
        <div data-testid="child">Child Content</div>
      </BearingIndicator>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByTestId("leaflet-tooltip")).not.toBeInTheDocument();
  });

  it("should render children and tooltip if bearing is valid", () => {
    render(
      <BearingIndicator bearing="N">
        <div data-testid="child">Child Content</div>
      </BearingIndicator>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("leaflet-tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("leaflet-tooltip")).toHaveClass("bearing-arrow");
  });

  it("should render the SVG with correct rotation for NE", () => {
    const { container } = render(
      <BearingIndicator bearing="NE">
        <div data-testid="child">Child Content</div>
      </BearingIndicator>
    );

    const group = container.querySelector("g");
    expect(group).toHaveAttribute("transform", expect.stringContaining("rotate(45)"));
  });

  it("should be case-insensitive", () => {
    const { container } = render(
      <BearingIndicator bearing="sw">
        <div data-testid="child">Child Content</div>
      </BearingIndicator>
    );

    const group = container.querySelector("g");
    expect(group).toHaveAttribute("transform", expect.stringContaining("rotate(225)"));
  });
});
