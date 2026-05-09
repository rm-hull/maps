import { describe, it, expect } from "vitest";
import { hashString, getBadgeStyles } from "./colors";

describe("colors utility", () => {
  describe("hashString", () => {
    it("should return a consistent hash for the same string", () => {
      const str = "test-string";
      expect(hashString(str)).toBe(hashString(str));
    });

    it("should return different hashes for different strings", () => {
      expect(hashString("string1")).not.toBe(hashString("string2"));
    });
  });

  describe("getBadgeStyles", () => {
    it("should return consistent styles for the same string", () => {
      const str = "line-1";
      expect(getBadgeStyles(str)).toEqual(getBadgeStyles(str));
    });

    it("should return a default palette for empty string", () => {
      expect(getBadgeStyles("")).toEqual({ colorPalette: "gray" });
    });

    it("should return different colors for '4', '16', and '64'", () => {
      const s4 = getBadgeStyles("4");
      const s16 = getBadgeStyles("16");
      const s64 = getBadgeStyles("64");

      expect(s4.backgroundColor).not.toBe(s16.backgroundColor);
      expect(s4.backgroundColor).not.toBe(s64.backgroundColor);
      expect(s16.backgroundColor).not.toBe(s64.backgroundColor);
    });
  });
});
