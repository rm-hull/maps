import { LatLngBounds } from "leaflet";
import { SearchResponse, UnsplashProxyResponse } from "./types";
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

export const fetchGeodsPOI = async (bounds: LatLngBounds): Promise<SearchResponse> => {
  if (API_URL === undefined) {
    throw Error("No GeoDS POI API URL specified");
  }

  // if (API_KEY === undefined) {
  //   throw Error("No GeoDS POI API Key specified");
  // }

  const resp = await client.get<SearchResponse>("/v1/geods-poi/search", {
    params: {
      bbox: [
        bounds.getWest().toFixed(4),
        bounds.getSouth().toFixed(4),
        bounds.getEast().toFixed(4),
        bounds.getNorth().toFixed(4),
      ].join(","),
    },
  });
  return resp.data;
};

export const fetchUnsplashImage = async (category: string): Promise<UnsplashProxyResponse> => {
  if (API_URL === undefined) {
    throw Error("No GeoDS POI API URL specified");
  }

  const resp = await client.get<UnsplashProxyResponse>(`/v1/geods-poi/image/${category}`);
  return resp.data;
};
