import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchGeodsPOI } from "../services/geods";
import { type SearchResponse } from "../services/geods/types";

export function useGeodsPOI(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["geodsPOI", bounds],
    queryFn: () => fetchGeodsPOI(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
