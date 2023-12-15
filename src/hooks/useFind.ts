import { type AxiosError } from "axios";
import { useQuery } from "react-query";
import { find } from "../services/osdatahub";
import { type Response } from "../services/osdatahub/types";

export default function useFind(query: string, maxResults = 1) {
  return useQuery<Response, AxiosError>(["find", query, maxResults], async () => await find(query, maxResults), {
    staleTime: Infinity,
  });
}
