 
 
 
import { type AxiosResponse } from "axios";
import { LatLng } from "leaflet";
import { vi } from "vitest";
import { convertKeys, toBNG, toLatLng } from "./helpers";

// Mock proj4 to return a converter with forward/inverse methods
vi.mock("proj4", () => {
  const mockConverter = (input: number[]) => {
    // Simple mock that converts WGS84 to BNG (approximate values for testing)
    if (input.length === 2) {
      // Forward: WGS84 to BNG
      const [lng, lat] = input;
      // Very rough approximation for testing
      const easting = (lng + 2) * 100000 + 400000;
      const northing = (lat - 49) * 110000;
      return [easting, northing];
    }
    return input;
  };

  mockConverter.forward = (input: number[]) => {
    const [lng, lat] = input;
    const easting = (lng + 2) * 100000 + 400000;
    const northing = (lat - 49) * 110000;
    return [easting, northing];
  };

  mockConverter.inverse = (input: number[]) => {
    const [easting, northing] = input;
    const lng = (easting - 400000) / 100000 - 2;
    const lat = northing / 110000 + 49;
    return [lng, lat];
  };

  const proj4Mock = vi.fn(() => mockConverter);
  return {
    default: proj4Mock,
  };
});

// Mock Leaflet's Proj
vi.mock("leaflet", async () => {
  const actual = await vi.importActual<typeof import("leaflet")>("leaflet");
  return {
    ...actual,
    Proj: {
      CRS: vi.fn(),
    },
  };
});

describe("osdatahub helpers", () => {
  describe("convertKeys", () => {
    it("should convert snake_case keys to camelCase in response data", () => {
      const response = {
        data: {
          first_name: "John",
          last_name: "Doe",
          email_address: "john@example.com",
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      } as AxiosResponse;

      const result = convertKeys(response);

      expect(result.data).toEqual({
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john@example.com",
      });
    });

    it("should handle arrays in response data", () => {
      const response = {
        data: [
          { user_name: "Alice", user_id: 1 },
          { user_name: "Bob", user_id: 2 },
        ],
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      } as AxiosResponse;

      const result = convertKeys(response);

      expect(result.data).toEqual([
        { userName: "Alice", userId: 1 },
        { userName: "Bob", userId: 2 },
      ]);
    });

    it("should handle null response data", () => {
      const response = {
        data: null,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      } as AxiosResponse;

      const result = convertKeys(response);

      expect(result.data).toBeNull();
    });

    it("should handle undefined response data", () => {
      const response = {
        data: undefined,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      } as AxiosResponse;

      const result = convertKeys(response);

      expect(result.data).toBeUndefined();
    });

    it("should handle primitive response data", () => {
      const response = {
        data: "simple string",
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as never,
      } as AxiosResponse;

      const result = convertKeys(response);

      expect(result.data).toBe("simple string");
    });
  });

  describe("toBNG", () => {
    it("should convert WGS84 coordinates to British National Grid", () => {
      const latLng = new LatLng(51.5074, -0.1278); // London
      const bng = toBNG(latLng);

      // Check that coordinates are returned as a tuple
      expect(Array.isArray(bng)).toBe(true);
      expect(bng).toHaveLength(2);
      // Check that values are numeric
      expect(typeof bng[0]).toBe("number");
      expect(typeof bng[1]).toBe("number");
    });

    it("should handle coordinates in Scotland", () => {
      const latLng = new LatLng(55.9533, -3.1883); // Edinburgh
      const bng = toBNG(latLng);

      // Check that coordinates are returned as a tuple
      expect(Array.isArray(bng)).toBe(true);
      expect(bng).toHaveLength(2);
      // Check that values are numeric
      expect(typeof bng[0]).toBe("number");
      expect(typeof bng[1]).toBe("number");
    });

    it("should return rounded integer values", () => {
      const latLng = new LatLng(51.5074, -0.1278);
      const bng = toBNG(latLng);

      expect(Number.isInteger(bng[0])).toBe(true);
      expect(Number.isInteger(bng[1])).toBe(true);
    });
  });

  describe("toLatLng", () => {
    it("should convert British National Grid to WGS84 coordinates", () => {
      const bng: [number, number] = [530047, 180381]; // London
      const latLng = toLatLng(bng);

      // Check that a LatLng object is returned
      expect(latLng).toBeInstanceOf(LatLng);
      // Check that lat and lng properties exist and are numbers
      expect(typeof latLng.lat).toBe("number");
      expect(typeof latLng.lng).toBe("number");
    });

    it("should handle coordinates in Scotland", () => {
      const bng: [number, number] = [325776, 673919]; // Edinburgh
      const latLng = toLatLng(bng);

      // Check that a LatLng object is returned
      expect(latLng).toBeInstanceOf(LatLng);
      // Check that lat and lng properties exist and are numbers
      expect(typeof latLng.lat).toBe("number");
      expect(typeof latLng.lng).toBe("number");
    });

    it("should be the inverse of toBNG", () => {
      const originalLatLng = new LatLng(52.2053, 0.1218); // Cambridge
      const bng = toBNG(originalLatLng);
      const convertedLatLng = toLatLng(bng);

      // With our mock implementation, the conversion should be reversible
      expect(convertedLatLng.lat).toBeCloseTo(originalLatLng.lat, 1);
      expect(convertedLatLng.lng).toBeCloseTo(originalLatLng.lng, 1);
    });
  });
});
