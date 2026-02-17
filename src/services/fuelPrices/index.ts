import axios from "axios";
import { LatLngBounds } from "leaflet";
import { dateReviver } from "@/utils/dates";
import { SearchResponse } from "./types";

const API_URL = import.meta.env.VITE_FUEL_PRICES_API_URL as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  transformResponse: (data: string) => JSON.parse(data, dateReviver) as SearchResponse,
});

export const fetchFuelPrices = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (!API_URL) {
    throw new Error("No fuel-prices API URL specified");
  }

  const resp = await client.get<SearchResponse>("/v1/fuel-prices/search", {
    params: { bbox: bounds.toBBoxString() },
  });
  return resp.data;
};
