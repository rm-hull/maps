import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchFuelPrices } from "../services/fuelPrices";
import { type SearchResponse } from "../services/fuelPrices/types";
import { getBoundsKey } from "@/utils/bounds";

export function useFuelPrices(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["fuelPrices", getBoundsKey(bounds)],
    queryFn: () => fetchFuelPrices(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
