export type StopType =
  | "BCT"
  | "BCS"
  | "BCE"
  | "BCQ"
  | "BST"
  | "FBT"
  | "RLY"
  | "RSE"
  | "RPL"
  | "PLT"
  | "TMU"
  | "MET"
  | "FER"
  | "FTD"
  | "AIR"
  | "GAT"
  | "TXR"
  | "STR";

export function isBusStop(stopType: StopType): boolean {
  return ["BCT", "BCS", "BCQ", "BST", "FBT"].includes(stopType);
}

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
  stop_type: StopType;
  bus_stop_type: string;
  timing_status: string;
  administrative_area_code: string;
  creation_date_time: Date;
  modification_date_time: Date;
  revision_number: number;
  modification: string;
  status: string;
}

export interface Response<T> {
  results: T[];
  attribution: string[];
  last_updated?: Date;
}

export interface NextDeparture {
  line_name: string;
  destination: string;
  operator_ref: string;
  aimed_arrival_time: Date;
  expected_arrival_time?: Date;
}
