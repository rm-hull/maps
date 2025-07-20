import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { useQuery } from "react-query";
import { fetchCompanyData } from "../services/companyData";
import { type SearchResponse } from "../services/companyData/types";

export function useCompanyData(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>(["companyData", bounds], () => fetchCompanyData(bounds), {
    staleTime: Infinity,
    cacheTime: 600_000, // 10 minutes
  });
}
