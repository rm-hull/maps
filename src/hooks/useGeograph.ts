import { useQuery } from "@tanstack/react-query";
import { type LatLng } from "leaflet";
import { fetchGeographItems } from "../services/geograph";
import { type Item } from "../services/geograph/types";
import { useCachedQuery } from "./useCachedQuery";

export function useGeograph(latLng: LatLng, distanceKm: number) {
  const { lat, lng } = latLng;

  return useCachedQuery(
    useQuery<Item[], Error>({
      queryKey: ["geograph", lat.toFixed(3), lng.toFixed(3), distanceKm.toFixed(3)],
      queryFn: () => fetchGeographItems(latLng, distanceKm),
      staleTime: 600_000, // 10 minutes
    })
  );
}
