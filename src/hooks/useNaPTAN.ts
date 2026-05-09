import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchNaPTAN } from "@/services/nextDepartures";
import { Response, NaPTAN } from "@/services/nextDepartures/types";
import { getBoundsKey } from "@/utils/bounds";

export function useNaPTAN(bounds: LatLngBounds) {
  return useQuery<Response<NaPTAN>, AxiosError>({
    queryKey: ["naptan", getBoundsKey(bounds, 3)],
    queryFn: () => fetchNaPTAN(bounds, 4),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
