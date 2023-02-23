import axios from "axios";
import { convertKeys } from "./helpers";
import { BritishNationalGrid, Response } from "./types";

export const API_KEY = process.env.REACT_APP_API_KEY;

const client = axios.create({
  baseURL: `https://api.os.uk`,
  timeout: 10000,
  params: { key: API_KEY },
});
client.interceptors.response.use(convertKeys, Promise.reject);

export const fetchNearest = async ([easting, northing]: BritishNationalGrid): Promise<Response> => {
  const params = { point: `${easting},${northing}` };
  const response = await client.get<Response>("/search/names/v1/nearest", { params });
  return response.data;
};
