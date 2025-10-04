import { type AxiosResponse } from "axios";
import { LatLng, Proj } from "leaflet";
import proj4 from "proj4";
import { camelCaseKeys } from "../../utils/camelCaseKeys";
import { type BritishNationalGrid } from "./types.d";

export function convertKeys<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  if (response.data !== undefined && response.data !== null) {
    response.data = camelCaseKeys(response.data as any) as T;
  }
  return response;
}

// Setup the EPSG:27700 (British National Grid) projection.
export const crs = new Proj.CRS(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs",
  {
    resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
    origin: [-238375.0, 1376256.0],
  }
);

const bngConverter = proj4("EPSG:4326", "EPSG:27700");

// BNG = British National Grid coordinates (easting/northing)
export function toBNG({ lat, lng }: LatLng): BritishNationalGrid {
  return bngConverter.forward([lng, lat]).map(Math.round) as BritishNationalGrid;
}

export function toLatLng(bng: BritishNationalGrid): LatLng {
  const [lng, lat] = bngConverter.inverse(bng);
  return new LatLng(lat, lng);
}
