import axios from "axios";
import { type LatLng } from "leaflet";
import { type Item, type Response } from "./types.d";

export const API_KEY = import.meta.env.VITE_GEOGRAPH_API_KEY as string;
if (API_KEY === undefined) {
  throw Error("No Geograph API key specified");
}

const client = axios.create({
  baseURL: "https://api.geograph.org.uk",
  timeout: 10000,
  params: { key: API_KEY, format: "JSON" },
});

export async function* images({ lat, lng }: LatLng, distanceKm: number, maxResults = 1000): AsyncGenerator<Item> {
  let results = 0;
  const params = { q: `${lat},${lng}`, distance: distanceKm.toFixed(3), perpage: 100 };
  const response = await client.get<Response>("/syndicator.php", { params });
  let nextURL = response.data.nextURL;

  for (const item of response.data.items) {
    yield item;
    results++;
  }

  while (results < maxResults) {
    if (nextURL === undefined) break;

    const nextResponse = await client.get<Response>(nextURL);
    nextURL = nextResponse.data.nextURL;

    for (const item of nextResponse.data.items) {
      yield item;
      results++;
    }
  }
}
