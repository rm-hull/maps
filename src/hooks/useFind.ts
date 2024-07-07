import { type AxiosError } from "axios";
import { useQuery } from "react-query";
import { find } from "../services/osdatahub";
import { type Response } from "../services/osdatahub/types.d";

interface UseFindReturnType {
  data?: Response;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useFind(query: string, maxResults = 1): UseFindReturnType {
  return useQuery<Response, AxiosError>(["find", query, maxResults], async () => await find(query, maxResults), {
    staleTime: Infinity,
  });
}
