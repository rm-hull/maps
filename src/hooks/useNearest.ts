import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { nearest } from "../services/osdatahub";
import { type BritishNationalGrid, type Response } from "../services/osdatahub/types";

export function useNearest(bng: BritishNationalGrid): UseQueryResult<Response, AxiosError> {
  return useQuery<Response, AxiosError>({
    queryKey: ["nearest", bng],
    queryFn: () => nearest(bng),
    staleTime: Infinity,
  });
}
