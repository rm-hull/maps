import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { useQuery } from "react-query";
import { fetchGeodsPOI } from "../services/geods";
import { type SearchResponse } from "../services/geods/types";

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
