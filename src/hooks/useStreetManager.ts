import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchStreetManagerEvents } from "../services/streetManager";
import { type SearchResponse } from "../services/streetManager/types";
import { getBoundsKey } from "@/utils/bounds";

export function useStreetManager(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["streetManager", getBoundsKey(bounds)],
    queryFn: () => fetchStreetManagerEvents(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
