import { type AxiosError } from "axios";
import { useQuery } from "react-query";

import { GeoJSONCollection, SupportedMimeTypes, fetchGeoJSON } from "../services/geojson";

export function useGeoJSON(url: string, type: SupportedMimeTypes) {
  return useQuery<GeoJSONCollection, AxiosError>(["geojson"], () => fetchGeoJSON(url, type), {
    staleTime: Infinity,
    enabled: false,
  });
}
