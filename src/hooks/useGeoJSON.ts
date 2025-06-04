import { type AxiosError } from "axios";
import { QueryStatus, useQuery } from "react-query";
import { fetchGeoJSON, GeoJSONCollection, SupportedMimeTypes } from "../services/geojson";

interface UseGeoJsonReturnType {
  data?: GeoJSONCollection;
  status: QueryStatus;
  error: AxiosError | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useGeoJSON(url: string, type: SupportedMimeTypes): UseGeoJsonReturnType {
  return useQuery<GeoJSONCollection, AxiosError>(["geojson"], () => fetchGeoJSON(url, type), {
    staleTime: Infinity,
    enabled: false,
  });
}
