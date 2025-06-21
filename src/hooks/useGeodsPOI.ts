import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { type SearchResponse } from "../services/geods/types";
import { fetchGeodsPOI } from "../services/geods";
import { useQuery } from "react-query";

export function useGeodsPOI(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>(
    ["geodsPOI", bounds],
    () => fetchGeodsPOI(bounds),
    {
      staleTime: Infinity,
      cacheTime: 600_000, // 10 minutes
    }
  );
}
