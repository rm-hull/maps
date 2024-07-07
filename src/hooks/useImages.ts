import { type AxiosError } from "axios";
import { type LatLng } from "leaflet";
import { type UseQueryResult, useQuery } from "react-query";
import { images } from "../services/geograph";
import { type Item } from "../services/geograph/types.d";

export function useImages(latLng: LatLng, distanceKm: number): UseQueryResult<Item[], AxiosError> {
  return useQuery<Item[], AxiosError>(
    ["images", latLng.lat.toFixed(3), latLng.lng.toFixed(3), distanceKm.toFixed(1)],
    async () => await images(latLng, distanceKm),
    {
      staleTime: Infinity,
    }
  );
}
