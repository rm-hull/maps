import { type QueryStatus, useQuery } from "react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { type SearchResponse } from "../services/geods/types";
import { fetchGeodsRoutes } from "../services/geods";

interface UseGeodsPOIReturnType {
  data?: SearchResponse;
  status: QueryStatus;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useGeodsPOI(bounds: LatLngBounds): UseGeodsPOIReturnType {
  return useQuery<SearchResponse, AxiosError>(
    ["gpsRoutes", bounds.getCenter().lat.toFixed(4), bounds.getCenter().lng.toFixed(4)],
    () => fetchGeodsRoutes(bounds),
    {
      staleTime: Infinity,
      cacheTime: 600_000, // 10 minutes
    }
  );
}
