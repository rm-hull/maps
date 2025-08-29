import { gpx, kml } from "@tmcw/togeojson";
import axios from "axios";
import { FeatureCollection, LineString } from "geojson";

export type GeoJSONCollection = FeatureCollection<LineString>;

export enum SupportedMimeTypes {
  GPX = "application/gpx+xml",
  KML = "application/vnd.google-earth.kml+xml",
}

export const fetchGeoJSON = async (url: string, type: SupportedMimeTypes): Promise<GeoJSONCollection> => {
  const resp = await axios.get<string>(url);
  const dom = new DOMParser().parseFromString(resp.data, "text/xml");
  switch (type) {
    case SupportedMimeTypes.GPX:
      return gpx(dom) as GeoJSONCollection;
    case SupportedMimeTypes.KML:
      return kml(dom) as GeoJSONCollection;
  }
};
