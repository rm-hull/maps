import { FeatureCollection } from "geojson";
import { LatLngBounds } from "leaflet";
import axios from "axios";
import { toBNG } from "../osdatahub/helpers";

const API_URL = import.meta.env.VITE_POSTCODE_POLYGONS_API_URL as string;
// const API_KEY = import.meta.env.VITE_POSTCODE_POLYGONS_API_KEY as string;

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // headers: {
  //   "X-API-Key": API_KEY,
  // },
});

export const fetchPolygons = async (bounds: LatLngBounds): Promise<FeatureCollection> => {
  if (API_URL === undefined) {
    throw Error("No Postcode Polygons API URL specified");
  }

  // if (API_KEY === undefined) {
  //   throw Error("No Postcode Polygons API Key specified");
  // }

  const [west, south] = toBNG(bounds.getSouthWest());
  const [east, north] = toBNG(bounds.getNorthEast());

  const resp = await client.get<FeatureCollection>("/v1/postcode/polygons", {
    params: {
      bbox: [west.toFixed(0), south.toFixed(0), east.toFixed(0), north.toFixed(0)].join(","),
    },
  });
  return resp.data;
};
