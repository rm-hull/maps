import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { getBoundsKey } from "@/utils/bounds";
import { fetchCompanyData } from "../services/companyData";
import { type SearchResponse } from "../services/companyData/types";

export function useCompanyData(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ["companyData", getBoundsKey(bounds)],
    queryFn: () => fetchCompanyData(bounds),
    staleTime: Infinity,
    gcTime: 600_000, // 10 minutes
  });
}
