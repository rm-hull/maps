import { type LatLngBounds } from "leaflet";
import { type QueryStatus, useQuery } from "react-query";
import { type AxiosError } from "axios";
import { fetchGpsRoutes } from "../services/gpsRoutes";
import { type SearchResponse } from "../services/gpsRoutes/types";

interface UseGpsRoutesReturnType {
  data?: SearchResponse;
  status: QueryStatus;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useGpsRoutes(bounds: LatLngBounds, truncateText = false): UseGpsRoutesReturnType {
  return useQuery<SearchResponse, AxiosError>(
    ["gpsRoutes", bounds.getCenter().lat.toFixed(2), bounds.getCenter().lng.toFixed(2)],
    () => fetchGpsRoutes(bounds, truncateText),
    {
      staleTime: Infinity,
      cacheTime: 600_000, // 10 minutes
    }
  );
}
