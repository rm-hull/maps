import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { useQuery } from "react-query";
import { type SearchResponse } from "../services/streetManager/types";
import { fetchStreetManagerEvents } from "../services/streetManager";

export function useStreetManager(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>(["streetManager", bounds], () => fetchStreetManagerEvents(bounds), {
    staleTime: Infinity,
    cacheTime: 600_000, // 10 minutes
  });
}
