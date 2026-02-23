import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchStreetLevelCrimes } from "../services/streetLevelCrimes";
import { StreetLevelCrime } from "@/services/streetLevelCrimes/types";

export function useStreetLevelCrimes(bounds: LatLngBounds, category: string, month: string) {
  return useQuery<StreetLevelCrime[], AxiosError>({
    queryKey: ["streetLevelCrimes", category, month, bounds.toBBoxString()],
    queryFn: () => fetchStreetLevelCrimes(bounds, category, month),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
