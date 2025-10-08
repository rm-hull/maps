import axios, { type AxiosResponse } from "axios";
import { beforeEach, vi } from "vitest";
import { fetchGeoJSON, SupportedMimeTypes } from "./index";

vi.mock("axios");
vi.mock("@tmcw/togeojson");

const mockedAxios = vi.mocked(axios, true);

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

      mockedAxios.get.mockResolvedValue({ data: mockGPXData } as AxiosResponse);

      const { gpx } = await import("@tmcw/togeojson");
      vi.mocked(gpx).mockReturnValue(mockGeoJSON);

      const result = await fetchGeoJSON("http://example.com/test.gpx", SupportedMimeTypes.GPX);

      // eslint-disable-next-line @typescript-eslint/unbound-method -- axios.get is a mocked method
      expect(mockedAxios.get).toHaveBeenCalledWith("http://example.com/test.gpx");
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

      mockedAxios.get.mockResolvedValue({ data: mockKMLData });

      const { kml } = await import("@tmcw/togeojson");
      vi.mocked(kml).mockReturnValue(mockGeoJSON);

      const result = await fetchGeoJSON("http://example.com/test.kml", SupportedMimeTypes.KML);

      // eslint-disable-next-line @typescript-eslint/unbound-method -- axios.get is a mocked method
      expect(mockedAxios.get).toHaveBeenCalledWith("http://example.com/test.kml");
      expect(result).toEqual(mockGeoJSON);
    });

    it("should handle axios errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      await expect(fetchGeoJSON("http://example.com/test.gpx", SupportedMimeTypes.GPX)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle invalid XML", async () => {
      const invalidXML = "not valid xml";

      mockedAxios.get.mockResolvedValue({ data: invalidXML });

      const { gpx } = await import("@tmcw/togeojson");
      vi.mocked(gpx).mockImplementation(() => {
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
