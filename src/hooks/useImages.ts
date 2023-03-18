import { AxiosError } from "axios";
import { LatLng } from "leaflet";
import { useQuery } from "react-query";
import { images } from "../services/geograph";
import { Response } from "../services/geograph/types";

export default function useImages(latLng: LatLng, distanceKm: number) {
  return useQuery<Response, AxiosError>(
    ["images", latLng.lat.toFixed(3), latLng.lng.toFixed(3), distanceKm.toFixed(1)],
    () => images(latLng, distanceKm),
    {
      staleTime: Infinity,
    }
  );
}
