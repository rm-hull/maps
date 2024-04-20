import { type AxiosError } from "axios";
import { useQuery } from "react-query";
import { nearest } from "../services/osdatahub";
import { type BritishNationalGrid, type Response } from "../services/osdatahub/types";

export default function useNearest(bng: BritishNationalGrid) {
  return useQuery<Response, AxiosError>(["nearest", bng], async () => await nearest(bng), {
    staleTime: Infinity,
  });
}
