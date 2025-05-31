import { type LatLng } from "leaflet";
import { fetchGeographSyndicatorEndpoint } from "../services/geograph";
import { type Item } from "../services/geograph/types";
import { useEffect, useState } from "react";

export function useGeograph(latLng: LatLng, distanceKm: number): Item[] {
  const [streamedItems, setStreamedItems] = useState<Item[]>([]);

  useEffect(() => {
    let isMounted = true; // To prevent state updates if component unmounts

    async function fetchStreamedData() {
      const results: any[] = [];
      const generator = fetchGeographSyndicatorEndpoint(latLng, distanceKm);

      for await (const item of generator) {
        if (!isMounted) break;
        results.push(item);
        setStreamedItems([...results]);
      }
    }

    fetchStreamedData();

    () => {
      isMounted = false;
    };
  }, [latLng, distanceKm]);

  return streamedItems;
}
