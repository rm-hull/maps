import { type AxiosError } from "axios";
import { type LatLng } from "leaflet";
import { useQuery } from "react-query";
import { convert3wa } from "../services/what3words";
import { type Response } from "../services/what3words/types";

export function useWhat3Words(latLng: LatLng) {
  return useQuery<Response, AxiosError>(["w3w", latLng], async () => await convert3wa(latLng), {
    staleTime: Infinity,
  });
}
