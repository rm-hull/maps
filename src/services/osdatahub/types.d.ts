import { type Range } from "../../types.d";

interface Header {
  format: "JSON" | "XML";
  maxResults: Range<1, 101>;
  offset: number;
  query: string;
  totalresults: number;
  uri: string;
}

export interface GazetteerEntry {
  country: string;
  countryUri: string;
  countyUnitary?: string;
  countyUnitaryUri?: string;
  countyUnitaryType?: string;
  districtBorough?: string;
  districtBoroughType: string;
  districtBoroughUri: string;
  geometryX: number;
  geometryY: number;
  id: string;
  leastDetailViewRes: number;
  localType: string;
  mbrXmax?: number;
  mbrXmin?: number;
  mbrYmax?: number;
  mbrYmin?: number;
  mostDetailViewRes: number;
  name1: string;
  namesUri: string;
  populatedPlace: string;
  populatedPlaceType: string;
  populatedPlaceUri: string;
  postcodeDistrict?: string;
  postcodeDistrictUri?: string;
  region: string;
  regionUri: string;
  type: string;
}

interface Result {
  gazetteerEntry: GazetteerEntry;
}

export interface Response {
  header: Header;
  results: Result[];
}

export type BritishNationalGrid = [number, number];
