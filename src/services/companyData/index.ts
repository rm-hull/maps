import { LatLngBounds } from "leaflet";
import { SearchResponse } from "./types";
import axios from "axios";
import { toBNG } from "../osdatahub/helpers";

const API_URL = import.meta.env.VITE_COMPANY_DATA_API_URL as string;
// const API_KEY = import.meta.env.VITE_COMPANY_DATA_API_KEY as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // headers: {
  //   "X-API-Key": API_KEY,
  // },
});

export const fetchCompanyData = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw Error("No Company Data API URL specified");
  }

  // if (API_KEY === undefined) {
  //   throw Error("No Company Data API Key specified");
  // }

  const [west, south] = toBNG(bounds.getSouthWest());
  const [east, north] = toBNG(bounds.getNorthEast());

  const resp = await client.get<SearchResponse>("/v1/company-data/search/by-postcode", {
    params: {
      bbox: [west.toFixed(0), south.toFixed(0), east.toFixed(0), north.toFixed(0)].join(","),
    },
  });
  return resp.data;
};
