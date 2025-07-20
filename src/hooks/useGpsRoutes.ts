import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { useQuery } from "react-query";

import { fetchGpsRoutes } from "../services/gpsRoutes";
import { type SearchResponse } from "../services/gpsRoutes/types";

export function useGpsRoutes(bounds: LatLngBounds, truncateText = false) {
  return useQuery<SearchResponse, AxiosError>(["gpsRoutes", bounds], () => fetchGpsRoutes(bounds, truncateText), {
    staleTime: Infinity,
    cacheTime: 600_000, // 10 minutes
  });
}
