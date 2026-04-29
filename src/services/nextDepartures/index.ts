import axios from "axios";
import { LatLngBounds } from "leaflet";
import { dateReviver } from "@/utils/dates";
import { SearchResponse } from "./types";

const API_URL = import.meta.env.VITE_NEXT_DEPARTURES_API_URL as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  transformResponse: (data: string) => JSON.parse(data, dateReviver) as SearchResponse,
});

export const fetchNaPTAN = async (bounds: LatLngBounds, dp = 3): Promise<SearchResponse> => {
  if (!API_URL) {
    throw new Error("No next-departures API URL specified");
  }

  const resp = await client.get<SearchResponse>("/v1/next-departures/search", {
    params: {
      bbox: [
        bounds.getWest().toFixed(dp),
        bounds.getSouth().toFixed(dp),
        bounds.getEast().toFixed(dp),
        bounds.getNorth().toFixed(dp),
      ].join(","),
    },
  });
  return resp.data;
};
