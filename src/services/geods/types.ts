export type SearchResponse = {
  results?: Result[];
};

type Result = {
  fid: number;
  geom: string;
  id: string;
  primary_name: string;
  categories?: string[];
  address?: string;
  locality?: string;
  postcode?: string;
  country?: string;
  source: string;
  source_record_id: string;
  lat: number;
  long: number;
  h3_15: string;
  easting: number;
  northing: number;
  lsoa21cd: string;
};

export interface UnsplashProxyResponse {
  src: string;
  alt: string;
  attribution: {
    name: string;
    link: string;
  };
}
