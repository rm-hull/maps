import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchGeonames } from "@/services/geonames";
import { Result } from "@/services/geonames/types";
import { getBoundsKey } from "@/utils/bounds";

export function useGeonames(bounds: LatLngBounds) {
  return useQuery<Result[], AxiosError>({
    queryKey: ["geonames", getBoundsKey(bounds)],
    queryFn: () => fetchGeonames(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
