import { type LatLng } from "leaflet";
import { fetchGeographSyndicatorEndpoint } from "../services/geograph";
import { type Item } from "../services/geograph/types";
import { useEffect, useState } from "react";

type UseGeographReturnType = {
  data: Item[];
  error?: Error;
};

export function useGeograph(latLng: LatLng, distanceKm: number): UseGeographReturnType {
  const [streamedItems, setStreamedItems] = useState<Item[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isMounted = true; // To prevent state updates if component unmounts

    async function fetchStreamedData() {
      try {
        const results: any[] = [];
        const generator = fetchGeographSyndicatorEndpoint(latLng, distanceKm);

        for await (const item of generator) {
          if (!isMounted) break;
          results.push(item);
          setStreamedItems([...results]);
        }
      } catch (err) {
        setError(err as Error);
      }
    }

    fetchStreamedData();

    () => {
      isMounted = false;
    };
  }, [latLng, distanceKm, setError]);

  return { data: streamedItems, error };
}
