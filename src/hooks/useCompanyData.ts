import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { fetchCompanyData } from "../services/companyData";
import { type SearchResponse } from "../services/companyData/types";
import { getBoundsKey } from "@/utils/bounds";

export function useCompanyData(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["companyData", getBoundsKey(bounds)],
    queryFn: () => fetchCompanyData(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
