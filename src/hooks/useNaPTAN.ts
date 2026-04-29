import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchNaPTAN } from "@/services/nextDepartures";
import { SearchResponse } from "@/services/nextDepartures/types";
import { getBoundsKey } from "@/utils/bounds";

export function useNaPTAN(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["naptan", getBoundsKey(bounds, 4)],
    queryFn: () => fetchNaPTAN(bounds, 4),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
