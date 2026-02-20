export interface Location {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  country: string;
  county?: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface DailyOpeningTimes {
  open: string;
  close: string;
  is_24_hours: boolean;
}

export interface BankHolidayOpeningTimes {
  type: string;
  open_time: string;
  close_time: string;
  is_24_hours: boolean;
}

export interface OpeningTimes {
  usual_days: Record<string, DailyOpeningTimes>;
  bank_holiday: BankHolidayOpeningTimes;
}

export interface PetrolFillingStation {
  node_id: string;
  mft_organisation_name: string;
  public_phone_number: string;
  trading_name: string;
  is_same_trading_and_brand_name: boolean;
  brand_name: string;
  temporary_closure: boolean;
  permanent_closure: boolean;
  permanent_closure_date?: Date;

  is_motorway_service_station: boolean;
  is_supermarket_service_station: boolean;

  location: Location;
  amenities: string[];
  opening_times: OpeningTimes;
  fuel_types: string[];
}

export interface PriceInfo {
  price: number;
  updated_on: Date;
  effective_on?: Date;
}

export interface Retailer {
  name: string;
  website_url: string;
  logo_url: string;
}

export interface SearchResult extends PetrolFillingStation {
  fuel_prices?: Record<string, PriceInfo[]>;
  retailer?: Retailer;
}

export interface SearchResponse {
  results: SearchResult[];
  attribution: string[];
  last_updated?: Date;
}
