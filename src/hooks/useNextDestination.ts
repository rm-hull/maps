import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { fetchNextDepartures } from "@/services/nextDepartures";
import { Response, NextDeparture } from "@/services/nextDepartures/types";

export function useNextDepartures(atcoCode: string) {
  return useQuery<Response<NextDeparture>, AxiosError>({
    queryKey: ["next-departures", atcoCode],
    queryFn: () => fetchNextDepartures(atcoCode),
    staleTime: 60_000, // 1 minute
    gcTime: 600_000, // 10 minutes
  });
}
