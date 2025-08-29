import { type AxiosError } from "axios";
import { FeatureCollection } from "geojson";
import { type LatLngBounds } from "leaflet";
import { useQuery } from "react-query";
import { fetchPolygons } from "../services/postcodePolygons";

export function usePostcodePolygons(bounds: LatLngBounds) {
  return useQuery<FeatureCollection, AxiosError>(["postcodePolygons", bounds], () => fetchPolygons(bounds), {
    staleTime: Infinity,
    cacheTime: 600_000, // 10 minutes
  });
}
