import { useEffect, useState } from "react";
import { type Item } from "../services/geograph/types";
import { type LatLng } from "leaflet";
import { fetchGeographSyndicatorEndpoint } from "../services/geograph";

export function useGeograph(latLng: LatLng, distanceKm: number) {
  const [streamedItems, setStreamedItems] = useState<Item[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let isMounted = true; // To prevent state updates if component unmounts

    async function fetchStreamedData() {
      try {
        const results: Item[] = [];
        const generator = fetchGeographSyndicatorEndpoint(latLng, distanceKm);

        for await (const item of generator) {
          if (!isMounted) break;
          results.push(item);
          setStreamedItems([...results]);
        }
      } catch (err) {
        setError(err as Error);
        setStreamedItems(undefined);
      }
    }

    fetchStreamedData();

    return () => {
      isMounted = false;
    };
  }, [latLng, distanceKm, setError]);

  return { data: streamedItems, error };
}
