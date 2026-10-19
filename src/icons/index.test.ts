import * as L from "leaflet";
import { describe, it, expect } from "vitest";
import { redMarker, greenMarker, blueMarker, violetMarker } from "./index";

describe("icons", () => {
  it("should have markers defined", () => {
    expect(redMarker).toBeInstanceOf(L.Icon);
    expect(greenMarker).toBeInstanceOf(L.Icon);
    expect(blueMarker).toBeInstanceOf(L.Icon);
    expect(violetMarker).toBeInstanceOf(L.Icon);
  });
});
