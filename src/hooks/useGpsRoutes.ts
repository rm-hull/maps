import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchGpsRoutes } from "../services/gpsRoutes";
import { type SearchResponse } from "../services/gpsRoutes/types";

export function useGpsRoutes(bounds: LatLngBounds, truncateText = false) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["gpsRoutes", bounds],
    queryFn: () => fetchGpsRoutes(bounds, truncateText),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
