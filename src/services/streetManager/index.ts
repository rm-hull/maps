import axios from "axios";
import { LatLngBounds } from "leaflet";
import { toBNG } from "../osdatahub/helpers";
import { SearchResponse } from "./types";

const API_URL = import.meta.env.VITE_STREET_MANAGER_API_URL as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const fetchStreetManagerEvents = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw new Error("No street-manager API URL specified");
  }

  const [west, south] = toBNG(bounds.getSouthWest());
  const [east, north] = toBNG(bounds.getNorthEast());

  const resp = await client.get<SearchResponse>("/v1/street-manager-relay/search", {
    params: {
      bbox: [west.toFixed(0), south.toFixed(0), east.toFixed(0), north.toFixed(0)].join(","),
    },
  });
  return resp.data;
};
