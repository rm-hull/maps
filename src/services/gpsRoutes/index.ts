import axios from "axios";
import { LatLngBounds } from "leaflet";

import { SearchRequest, SearchResponse } from "./types";

const API_URL = import.meta.env.VITE_GPS_ROUTES_API_URL as string;
const API_KEY = import.meta.env.VITE_GPS_ROUTES_API_KEY as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "X-API-Key": API_KEY,
  },
});

export const fetchGpsRoutes = async (bounds: LatLngBounds, truncateText: boolean): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw new Error("No GPS Routes API URL specified");
  }

  if (API_KEY === undefined) {
    throw new Error("No GPS Routes API Key specified");
  }

  const payload: SearchRequest = {
    boundingBox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
    query: "",
    offset: 0,
    limit: 100,
    truncateText,
    skipFacets: true,
  };

  const resp = await client.post<SearchResponse>("/v1/gps-routes/search", payload);
  return resp.data;
};
