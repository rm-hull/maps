import axios from "axios";
import { type Response } from "./types";

const API_URL = import.meta.env.VITE_PLACENAMES_API_URL as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 3000,
});

export const suggest = async (prefix: string, maxResults = 1): Promise<Response> => {
  if (API_URL === undefined) {
    throw new Error("No Place-names API URL specified");
  }
  const response = await client.get<Response>(`/v1/place-names/prefix/${prefix}`, {
    params: { max_results: maxResults },
  });
  return response.data;
};
