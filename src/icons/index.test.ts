import { describe, it, expect } from "vitest";
import { bearingAngles, redMarker, greenMarker, blueMarker, violetMarker } from "./index";
import * as L from "leaflet";

describe("icons", () => {
  it("should have correct bearing angles", () => {
    expect(bearingAngles.N).toBe(0);
    expect(bearingAngles.NE).toBe(45);
    expect(bearingAngles.E).toBe(90);
    expect(bearingAngles.S).toBe(180);
    expect(bearingAngles.W).toBe(270);
  });

  it("should have markers defined", () => {
    expect(redMarker).toBeInstanceOf(L.Icon);
    expect(greenMarker).toBeInstanceOf(L.Icon);
    expect(blueMarker).toBeInstanceOf(L.Icon);
    expect(violetMarker).toBeInstanceOf(L.Icon);
  });
});
