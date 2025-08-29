export type Nearby = {
  objectID: string;
  ref: string;
  description: string;
};

export type Image = {
  src: string;
  title: string;
  caption: string;
};

export type Detail = {
  subtitle: string;
  content: string;
};

export type GeoLoc = {
  lat: number;
  lng: number;
};

export type Summary = {
  objectID: string;
  ref: string;
  title: string;
  description: string;
  headline_image_url?: string;
  distance_km: number;
  _geoloc: GeoLoc;
};

export interface Result extends Summary {
  created_at: string;
  video_url?: string;
  gpx_url?: string;
  country?: string;
  state?: string;
  county?: string;
  region?: string;
  district?: string;
  postcode?: string;
  display_address?: string;
  nearby?: Nearby[];
  images?: Image[];
  details?: Detail[];
}

export type SearchRequest = {
  query: string;
  offset: number;
  limit: number;
  boundingBox?: number[];
  nearby?: {
    place?: string;
    center?: GeoLoc;
    distanceKm: number;
  };
  facets?: Record<string, string[] | undefined>;
  truncateText?: boolean;
  skipFacets?: boolean;
};

export type SearchResponse = {
  hits: Summary[];
  total: number;
  facets?: Record<string, Record<string, number>>;
};
