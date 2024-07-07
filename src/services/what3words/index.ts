import axios from "axios";
import { type Response } from "./types";
import { LatLng } from "leaflet";

export const API_KEY = import.meta.env.VITE_WHAT3WORDS_API_KEY as string;
if (API_KEY === undefined) {
  throw Error("No What3Words API key specified");
}

const client = axios.create({
  baseURL: "https://api.what3words.com",
  timeout: 10000,
  params: { key: API_KEY },
});

export const convert3wa = async ({ lat, lng }: LatLng): Promise<Response> => {
  const params = { coordinates: `${lat},${lng}` };
  const response = await client.get<Response>("/v3/convert-to-3wa", { params });
  return response.data;
};
