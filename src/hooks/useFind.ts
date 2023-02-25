import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { find } from "../services/osdatahub";
import { Response } from "../services/osdatahub/types";

export default function useFind(query: string, maxResults = 1) {
  return useQuery<Response, AxiosError>(["find", query, maxResults], () => find(query, maxResults), {
    staleTime: Infinity,
  });
}
