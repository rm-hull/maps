import { LatLngBounds } from "leaflet";
import { SearchResponse } from "./types";
import axios from "axios";

const API_URL = import.meta.env.VITE_GEODS_POI_API_URL as string;
// const API_KEY = import.meta.env.VITE_GEODS_POI_API_KEY as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // headers: {
  //   "X-API-Key": API_KEY,
  // },
});

export const fetchGeodsRoutes = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw Error("No POI API URL specified");
  }

  // if (API_KEY === undefined) {
  //   throw Error("No GPS Routes API Key specified");
  // }

  const resp = await client.get<SearchResponse>("/v1/poi/search", {
    params: { bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(",") },
  });
  return resp.data;
};
