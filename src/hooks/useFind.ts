import { type AxiosError } from "axios";
import { useQuery } from "react-query";
import { find } from "../services/osdatahub";
import { type Response } from "../services/osdatahub/types";

interface UseFindReturnType {
  data?: Response;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useFind(query: string, maxResults = 1): UseFindReturnType {
  return useQuery<Response, AxiosError>(["find", query, maxResults], () => find(query, maxResults), {
    staleTime: Infinity,
    enabled: !!query,
  });
}
