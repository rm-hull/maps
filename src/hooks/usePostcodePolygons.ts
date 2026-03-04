import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { FeatureCollection } from "geojson";
import { type LatLngBounds } from "leaflet";
import { fetchPolygons } from "../services/postcodePolygons";
import { getBoundsKey } from "@/utils/bounds";

export function usePostcodePolygons(bounds: LatLngBounds) {
  return useQuery<FeatureCollection, AxiosError>({
    queryKey: ["postcodePolygons", getBoundsKey(bounds)],
    queryFn: () => fetchPolygons(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
