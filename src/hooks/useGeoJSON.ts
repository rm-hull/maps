import { GeoJSONCollection, SupportedMimeTypes, fetchGeoJSON } from "../services/geojson";
import { type AxiosError } from "axios";
import { useQuery } from "react-query";

export function useGeoJSON(url: string, type: SupportedMimeTypes) {
  return useQuery<GeoJSONCollection, AxiosError>(["geojson"], () => fetchGeoJSON(url, type), {
    staleTime: Infinity,
    enabled: false,
  });
}
