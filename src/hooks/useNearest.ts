import { type BritishNationalGrid, type Response } from "../services/osdatahub/types.d";
import { type UseQueryResult, useQuery } from "react-query";
import { type AxiosError } from "axios";
import { nearest } from "../services/osdatahub";

export function useNearest(bng: BritishNationalGrid): UseQueryResult<Response, AxiosError> {
  return useQuery<Response, AxiosError>(["nearest", bng], () => nearest(bng), {
    staleTime: Infinity,
  });
}
