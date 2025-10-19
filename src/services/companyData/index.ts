import axios from "axios";
import { LatLngBounds } from "leaflet";
import { dateReviver } from "@/utils/dates";
import { toBNG } from "../osdatahub/helpers";
import { SearchResponse } from "./types";

const API_URL = import.meta.env.VITE_COMPANY_DATA_API_URL as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  transformResponse: (data: string) => JSON.parse(data, dateReviver) as SearchResponse,
});

export const fetchCompanyData = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw new Error("No Company Data API URL specified");
  }

  const [west, south] = toBNG(bounds.getSouthWest());
  const [east, north] = toBNG(bounds.getNorthEast());

  const resp = await client.get<SearchResponse>("/v1/company-data/search/by-postcode", {
    params: {
      bbox: [west.toFixed(0), south.toFixed(0), east.toFixed(0), north.toFixed(0)].join(","),
    },
  });
  return resp.data;
};
