import { type QueryStatus, useQuery } from "react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { type SearchResponse } from "../services/gpsRoutes/types";
import { fetchGpsRoutes } from "../services/gpsRoutes";

interface UseGpsRoutesReturnType {
  data?: SearchResponse;
  status: QueryStatus;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useGpsRoutes(bounds: LatLngBounds, truncateText = false): UseGpsRoutesReturnType {
  return useQuery<SearchResponse, AxiosError>(
    ["gpsRoutes", bounds.getCenter().lat.toFixed(4), bounds.getCenter().lng.toFixed(4)],
    () => fetchGpsRoutes(bounds, truncateText),
    {
      staleTime: Infinity,
      cacheTime: 600_000, // 10 minutes
    }
  );
}
