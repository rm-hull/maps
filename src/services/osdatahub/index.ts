import axios from "axios";
import { convertKeys } from "./helpers";
import { BritishNationalGrid, Response } from "./types";

export const API_KEY = process.env.REACT_APP_OS_DATAHUB_API_KEY;

const client = axios.create({
  baseURL: "https://api.os.uk",
  timeout: 10000,
  params: { key: API_KEY },
});
client.interceptors.response.use(convertKeys, Promise.reject);

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
