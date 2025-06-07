import { type AxiosError } from "axios";
import { type Response } from "../services/osdatahub/types.d";
import { find } from "../services/osdatahub";
import { useQuery } from "react-query";

interface UseFindReturnType {
  data?: Response;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useFind(query: string, maxResults = 1): UseFindReturnType {
  return useQuery<Response, AxiosError>(["find", query, maxResults], () => find(query, maxResults), {
    staleTime: Infinity,
  });
}
