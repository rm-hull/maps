import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import { OSMap } from "./OSMap";

describe("OSMap", () => {
  it("should render the map container", () => {
    render(<OSMap />);
    const mapContainer = document.querySelector(".leaflet-container");
    expect(mapContainer).toBeInTheDocument();
  });
});
