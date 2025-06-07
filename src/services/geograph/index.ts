import { type Item, type Response } from "./types.d";
import { type LatLng } from "leaflet";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOGRAPH_API_KEY as string;

const client = axios.create({
  baseURL: "https://api.geograph.org.uk",
  timeout: 10000,
  params: { key: API_KEY, format: "JSON" },
});

export async function* fetchGeographSyndicatorEndpoint(
  { lat, lng }: LatLng,
  distanceKm: number,
  maxResults = 1000
): AsyncGenerator<Item> {
  if (API_KEY === undefined) {
    throw Error("No Geograph API key specified");
  }

  let results = 0;
  const params = { q: `${lat},${lng}`, distance: distanceKm.toFixed(3), perpage: 100 };
  const response = await client.get<Response>("/syndicator.php", { params });
  if (response.status !== 200) {
    throw new Error(`Failed to fetch Geograph data: ${response.statusText}`);
  }

  for (const item of response.data.items) {
    yield item;
    results++;
  }

  let nextURL = response.data.nextURL;
  while (results < maxResults && !!nextURL) {
    if (nextURL === undefined) break;

    const nextResponse = await client.get<Response>(nextURL);
    if (nextResponse.status !== 200) {
      throw new Error(`Failed to fetch Geograph data: ${nextResponse.statusText}`);
    }

    nextURL = nextResponse.data.nextURL;
    for (const item of nextResponse.data.items) {
      yield item;
      results++;
    }
  }
}
