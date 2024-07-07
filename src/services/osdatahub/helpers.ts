import { type AxiosResponse } from "axios";
import { type LatLng, type LatLngTuple } from "leaflet";
import proj4 from "proj4";
import camelCaseKeys from "../../utils/camelCaseKeys";
import { type BritishNationalGrid } from "./types.d";

export function convertKeys<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  if (response.data !== undefined && response.data !== null) {
    response.data = camelCaseKeys(response.data) as T;
  }
  return response;
}

// BNG = British National Grid coordinates (easting/northing)
export function toBNG({ lat, lng }: LatLng): BritishNationalGrid {
  return proj4("EPSG:4326", "EPSG:27700", [lng, lat]).map(Math.round) as BritishNationalGrid;
}

export function toLatLng(bng: BritishNationalGrid): LatLngTuple {
  return proj4("EPSG:27700", "EPSG:4326", bng).reverse() as LatLngTuple;
}
