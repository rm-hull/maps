import { type LatLng } from "leaflet";
import { useEffect, useState } from "react";

import { fetchGeographSyndicatorEndpoint } from "../services/geograph";
import { type Item } from "../services/geograph/types";

export function useGeograph(latLng: LatLng, distanceKm: number) {
  const [streamedItems, setStreamedItems] = useState<Item[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let isMounted = true; // To prevent state updates if component unmounts

    async function fetchStreamedData() {
      const results: Item[] = [];
      const generator = fetchGeographSyndicatorEndpoint(latLng, distanceKm);

      for await (const item of generator) {
        if (!isMounted) break;
        results.push(item);
        if (results.length % 10 === 0) {
          setStreamedItems([...results]);
        }
      }
      setStreamedItems([...results]);
    }

    fetchStreamedData().catch((err) => {
      if (isMounted) {
        setError(err as Error);
        setStreamedItems(undefined);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [latLng, distanceKm, setError]);

  return { data: streamedItems, error };
}
