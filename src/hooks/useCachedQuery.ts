import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useCachedQuery<TData, TError>(queryResult: UseQueryResult<TData, TError>) {
  const [cache, setCache] = useState<TData>();

  useEffect(() => {
    if (queryResult.isSuccess) {
      queueMicrotask(() => setCache(queryResult.data));
    }
  }, [queryResult.isSuccess, queryResult.data]);

  return {
    ...queryResult,
    data: cache,
    isCached: queryResult.isSuccess && cache !== undefined,
  };
}
