import { useEffect, useState } from "react";
import { UseQueryResult } from "react-query";

export function useCachedQuery<TData, TError>(queryResult: UseQueryResult<TData, TError>) {
  const [cache, setCache] = useState<TData>();

  useEffect(() => {
    if (queryResult.isSuccess) {
      setCache(queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data]);

  return {
    ...queryResult,
    data: cache,
    isCached: queryResult.isSuccess && cache !== undefined,
  };
}
