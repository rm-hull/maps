import axios from "axios";
import { LatLngBounds } from "leaflet";
import { StreetLevelCrime } from "./types";

const client = axios.create({
  baseURL: "https://data.police.uk/api",
  timeout: 10000,
});

export const fetchStreetLevelCrimes = async (
  bounds: LatLngBounds,
  category: string,
  month: string
): Promise<StreetLevelCrime[]> => {
  const poly = [bounds.getNorthWest(), bounds.getNorthEast(), bounds.getSouthEast(), bounds.getSouthWest()]
    .map((latlng) => `${latlng.lat.toFixed(3)},${latlng.lng.toFixed(3)}`)
    .join(":");

  const resp = await client.get<StreetLevelCrime[]>(`/crimes-street/${category}`, { params: { date: month, poly } });
  return resp.data;
};
