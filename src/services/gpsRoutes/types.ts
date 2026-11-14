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

export type BoundingBox = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export type Summary = {
  objectID: string;
  ref: string;
  title: string;
  description: string;
  headline_image_url?: string;
  distance_km?: number;
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
  estimated_duration?: string;
  difficulty?: string;
  terrain?: string[];
  points_of_interest?: string[];
  facilities?: string[];
  route_type?: string;
  activities?: string[];
}

export type SearchRequest = {
  query: string;
  offset: number;
  limit: number;
  boundingBox?: BoundingBox;
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
  boundingBox?: BoundingBox;
  facets?: Record<string, Record<string, number>>;
  attribution?: string[];
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset?: number;
};
