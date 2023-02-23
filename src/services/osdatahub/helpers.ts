import { AxiosResponse } from "axios";
import { LatLng, LatLngTuple } from "leaflet";
import proj4 from "proj4";
import camelCaseKeys from "../../utils/camelCaseKeys";
import { BritishNationalGrid } from "./types";

export function convertKeys<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  if (response.data) response.data = camelCaseKeys(response.data);
  return response;
}

// BNG = British National Grid coordinates (easting/northing)
export function toBNG({ lat, lng }: LatLng): BritishNationalGrid {
  return proj4("EPSG:4326", "EPSG:27700", [lng, lat]).map(Math.round) as BritishNationalGrid;
}

export function toLatLng(bng: BritishNationalGrid): LatLngTuple {
  return proj4("EPSG:27700", "EPSG:4326", bng).reverse() as LatLngTuple;
}
