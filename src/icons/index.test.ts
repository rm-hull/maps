import { describe, it, expect } from "vitest";
import { busStopWithBearing, busStop } from "./index";
import * as L from "leaflet";

describe("icons", () => {
  describe("busStopWithBearing", () => {
    it("should return the default busStop icon if bearing is invalid", () => {
      const icon = busStopWithBearing("INVALID");
      expect(icon).toBe(busStop);
    });

    it("should return a DivIcon if bearing is valid", () => {
      const icon = busStopWithBearing("N");
      expect(icon).toBeInstanceOf(L.DivIcon);
      const options = icon.options as L.DivIconOptions;
      expect(typeof options.html).toBe("string");
      const html = options.html as string;
      expect(html).toContain("<svg");
      expect(html).toContain("rotate(0)");
      expect(html).toContain("bus-stop.webp");
    });

    it("should apply correct rotation for NE", () => {
      const icon = busStopWithBearing("NE");
      const options = icon.options as L.DivIconOptions;
      const html = options.html as string;
      expect(html).toContain("rotate(45)");
    });

    it("should apply correct rotation for S", () => {
      const icon = busStopWithBearing("S");
      const options = icon.options as L.DivIconOptions;
      const html = options.html as string;
      expect(html).toContain("rotate(180)");
    });

    it("should be case-insensitive", () => {
      const icon = busStopWithBearing("ne");
      const options = icon.options as L.DivIconOptions;
      const html = options.html as string;
      expect(html).toContain("rotate(45)");
    });
  });
});
