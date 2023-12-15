import { type AxiosError } from "axios";
import { type LatLng } from "leaflet";
import { useQuery } from "react-query";
import { images } from "../services/geograph";
import { type Response } from "../services/geograph/types";

export default function useImages(latLng: LatLng, distanceKm: number) {
  return useQuery<Response, AxiosError>(
    ["images", latLng.lat.toFixed(3), latLng.lng.toFixed(3), distanceKm.toFixed(1)],
    async () => await images(latLng, distanceKm),
    {
      staleTime: Infinity,
    }
  );
}
