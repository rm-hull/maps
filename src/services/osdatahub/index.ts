import axios from "axios";
import { convertKeys } from "./helpers";
import { type BritishNationalGrid, type Response } from "./types";

export const API_KEY = import.meta.env.VITE_OS_DATAHUB_API_KEY as string;
if (API_KEY === undefined) {
  throw Error("No OS DataHub API key specified");
}

const client = axios.create({
  baseURL: "https://api.os.uk",
  timeout: 10000,
  params: { key: API_KEY },
});
client.interceptors.response.use(convertKeys);

export const nearest = async ([easting, northing]: BritishNationalGrid): Promise<Response> => {
  const params = { point: `${easting},${northing}` };
  const response = await client.get<Response>("/search/names/v1/nearest", { params });
  return response.data;
};

export const find = async (query: string, maxResults: number): Promise<Response> => {
  const params = { query, maxResults };
  const response = await client.get<Response>("/search/names/v1/find", { params });
  return response.data;
};
