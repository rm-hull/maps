import { Photo, Response } from "./types";
import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

export async function unsplashImageSearch(category: string): Promise<Photo> {
  const params = new URLSearchParams();
  params.append("query", category);
  params.append("per_page", "1");
  params.append("orientation", "landscape");
  params.append("order_by", "relevant");
  const resp = await axios.get<Response>(`${UNSPLASH_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (resp.data.results.length === 0) {
    throw new Error(`No Unsplash photo found for category: ${category}`);
  }
  return resp.data.results[0];
}
