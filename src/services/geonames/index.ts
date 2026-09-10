import axios from "axios";
import { LatLngBounds } from "leaflet";
import { Result } from "./types";

const API_KEY = import.meta.env.VITE_GEONAMES_API_KEY as string;

const client = axios.create({
  baseURL: "https://secure.geonames.org",
  params: { username: API_KEY },
  timeout: 10000,
});

export const fetchGeonames = async (bounds: LatLngBounds): Promise<Result[]> => {
  if (!API_KEY) {
    throw new Error("No geonames API key specified");
  }

  const resp = await client.get<{ geonames: Result[] }>("/wikipediaBoundingBoxJSON", {
    params: {
      north: bounds.getNorth().toFixed(3),
      east: bounds.getEast().toFixed(3),
      south: bounds.getSouth().toFixed(3),
      west: bounds.getWest().toFixed(3),
    },
  });
  return resp.data.geonames;
};
