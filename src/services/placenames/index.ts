import axios from "axios";
import { type Response } from "./types";

export const OS_DATAHUB_API_KEY = import.meta.env.VITE_OS_DATAHUB_API_KEY as string;
if (OS_DATAHUB_API_KEY === undefined) {
  throw new Error("No OS DataHub API key specified");
}

export type Options = {
  maxResults: number;
  filterCategories: string[];
};

const client = axios.create({
  baseURL: "https://api.destructuring-bind.org",
  timeout: 10000,
});

export const suggest = async (prefix: string): Promise<Response> => {
  const response = await client.get<Response>(`/v1/place-names/prefix/${prefix}`);
  return response.data;
};
