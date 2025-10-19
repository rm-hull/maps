import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { GeoJSONCollection, SupportedMimeTypes, fetchGeoJSON } from "../services/geojson";

export function useGeoJSON(url: string, type: SupportedMimeTypes) {
  return useQuery<GeoJSONCollection, AxiosError>({
    queryKey: ["geojson"],
    queryFn: () => fetchGeoJSON(url, type),
    staleTime: Infinity,
    enabled: false,
  });
}
