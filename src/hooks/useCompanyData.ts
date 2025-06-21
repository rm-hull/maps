import { type AxiosError } from "axios";
import { type LatLngBounds } from "leaflet";
import { type SearchResponse } from "../services/companyData/types";
import { fetchCompanyData } from "../services/companyData";
import { useQuery } from "react-query";

export function useCompanyData(bounds: LatLngBounds) {
  return useQuery<SearchResponse, AxiosError>(["companyData", bounds], () => fetchCompanyData(bounds), {
    staleTime: Infinity,
    cacheTime: 600_000, // 10 minutes
  });
}
