import { type AxiosError } from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import { nearest } from "../services/osdatahub";
import { type BritishNationalGrid, type Response } from "../services/osdatahub/types.d";

export function useNearest(bng: BritishNationalGrid): UseQueryResult<Response, AxiosError> {
  return useQuery<Response, AxiosError>(["nearest", bng], async () => await nearest(bng), {
    staleTime: Infinity,
  });
}
