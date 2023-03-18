import axios from "axios";
import { LatLng } from "leaflet";
import { Response } from "./types";

export const API_KEY = process.env.REACT_APP_GEOGRAPH_API_KEY;

const client = axios.create({
  baseURL: "https://api.geograph.org.uk",
  timeout: 10000,
  params: { key: API_KEY, format: "JSON" },
});

export const images = async ({ lat, lng }: LatLng, distanceKm: number): Promise<Response> => {
  const params = { q: `${lat},${lng}`, distance: distanceKm.toFixed(3), perpage: 100 };
  const response = await client.get<Response>("/syndicator.php", { params });
  return response.data;
};