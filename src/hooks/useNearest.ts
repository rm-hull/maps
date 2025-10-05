import { type AxiosError } from "axios";
import { type UseQueryResult, useQuery } from "react-query";
import { nearest } from "../services/osdatahub";
import { type BritishNationalGrid, type Response } from "../services/osdatahub/types";

export function useNearest(bng: BritishNationalGrid): UseQueryResult<Response, AxiosError> {
  return useQuery<Response, AxiosError>(["nearest", bng], () => nearest(bng), {
    staleTime: Infinity,
  });
}
