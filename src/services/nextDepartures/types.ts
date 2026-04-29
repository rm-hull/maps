export interface NaPTAN {
  atco_code: string;
  naptan_code: string;
  common_name: string;
  short_common_name: string;
  landmark: string;
  street: string;
  indicator: string;
  bearing: string;
  nptg_locality_code: string;
  locality_name: string;
  parent_locality_name: string;
  town: string;
  suburb: string;
  locality_centre: false;
  grid_type: string;
  easting: number;
  northing: number;
  longitude: number;
  latitude: number;
  stop_type: string;
  bus_stop_type: string;
  timing_status: string;
  administrative_area_code: string;
  creation_date_time: Date;
  modification_date_time: Date;
  revision_number: number;
  modification: string;
  status: string;
}

export interface SearchResponse {
  results: NaPTAN[];
  attribution: string[];
  last_updated?: Date;
}
