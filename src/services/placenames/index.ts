import axios from "axios";
import { type Response } from "./types";

const API_URL = import.meta.env.VITE_PLACENAMES_API_URL as string;
if (API_URL === undefined) {
  throw new Error("No Place Names API URL specified");
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 3000,
});

export const suggest = async (prefix: string): Promise<Response> => {
  const response = await client.get<Response>(`/v1/place-names/prefix/${prefix}`);
  return response.data;
};
