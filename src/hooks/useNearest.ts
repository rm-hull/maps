import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { nearest } from "../services/osdatahub";
import { BritishNationalGrid, Response } from "../services/osdatahub/types";

export default function useNearest(bng: BritishNationalGrid) {
  return useQuery<Response, AxiosError>(["nearest", bng], () => nearest(bng), {
    staleTime: Infinity,
  });
}
