/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import axios from "axios";
import { beforeEach, vi } from "vitest";
import { fetchGeoJSON, SupportedMimeTypes } from "./index";

vi.mock("axios");
vi.mock("@tmcw/togeojson");

describe("geojson service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchGeoJSON", () => {
    it("should fetch and parse GPX data", async () => {
      const mockGPXData = `<?xml version="1.0"?>
        <gpx version="1.1">
          <trk>
            <trkseg>
              <trkpt lat="51.5" lon="-0.1"></trkpt>
            </trkseg>
          </trk>
        </gpx>`;

      const mockGeoJSON = {
        type: "FeatureCollection",
        features: [],
      };

      (axios.get as any).mockResolvedValue({ data: mockGPXData });

      const { gpx } = await import("@tmcw/togeojson");
      (gpx as any).mockReturnValue(mockGeoJSON);

      const result = await fetchGeoJSON("http://example.com/test.gpx", SupportedMimeTypes.GPX);

      expect(axios.get).toHaveBeenCalledWith("http://example.com/test.gpx");
      expect(result).toEqual(mockGeoJSON);
    });

    it("should fetch and parse KML data", async () => {
      const mockKMLData = `<?xml version="1.0"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
          <Document>
            <Placemark>
              <Point>
                <coordinates>-0.1,51.5</coordinates>
              </Point>
            </Placemark>
          </Document>
        </kml>`;

      const mockGeoJSON = {
        type: "FeatureCollection",
        features: [],
      };

      (axios.get as any).mockResolvedValue({ data: mockKMLData });

      const { kml } = await import("@tmcw/togeojson");
      (kml as any).mockReturnValue(mockGeoJSON);

      const result = await fetchGeoJSON("http://example.com/test.kml", SupportedMimeTypes.KML);

      expect(axios.get).toHaveBeenCalledWith("http://example.com/test.kml");
      expect(result).toEqual(mockGeoJSON);
    });

    it("should handle axios errors", async () => {
      (axios.get as any).mockRejectedValue(new Error("Network error"));

      await expect(fetchGeoJSON("http://example.com/test.gpx", SupportedMimeTypes.GPX)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle invalid XML", async () => {
      const invalidXML = "not valid xml";

      (axios.get as any).mockResolvedValue({ data: invalidXML });

      const { gpx } = await import("@tmcw/togeojson");
      (gpx as any).mockImplementation(() => {
        throw new Error("Invalid XML");
      });

      await expect(fetchGeoJSON("http://example.com/test.gpx", SupportedMimeTypes.GPX)).rejects.toThrow("Invalid XML");
    });
  });

  describe("SupportedMimeTypes", () => {
    it("should have GPX mime type", () => {
      expect(SupportedMimeTypes.GPX).toBe("application/gpx+xml");
    });

    it("should have KML mime type", () => {
      expect(SupportedMimeTypes.KML).toBe("application/vnd.google-earth.kml+xml");
    });
  });
});
