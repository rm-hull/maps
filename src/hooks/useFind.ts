import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { find } from "../services/osdatahub";
import { type Response } from "../services/osdatahub/types";

interface UseFindReturnType {
  data?: Response;
  error: AxiosError | null;
  isLoading: boolean;
}

export function useFind(query: string, maxResults = 1): UseFindReturnType {
  return useQuery<Response, AxiosError>({
    queryKey: ["find", query, maxResults],
    queryFn: () => find(query, { maxResults }),
    staleTime: Infinity,
    enabled: !!query,
  });
}
