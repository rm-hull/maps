import { FeatureCollection, LineString } from "geojson";
import { gpx, kml } from "@tmcw/togeojson";
import axios from "axios";

export type GeoJSONCollection = FeatureCollection<LineString>;

export enum SupportedMimeTypes {
  GPX = "application/gpx+xml",
  KML = "application/vnd.google-earth.kml+xml",
}

export const fetchGeoJSON = async (url: string, type: SupportedMimeTypes): Promise<GeoJSONCollection> => {
  const resp = await axios.get(url);
  const dom = new DOMParser().parseFromString(resp.data, "text/xml");
  return (type === "application/gpx+xml" ? gpx(dom) : kml(dom)) as GeoJSONCollection;
};
