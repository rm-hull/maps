import { type LatLngTuple } from "leaflet";
import { useLocalStorage } from "./useLocalStorage";

export type InitialLocation = "default" | "current" | "custom";

export type MapStyle = "leisure" | "roads" | "outdoor" | "light";

export interface CustomLocation {
  searchTerm: string;
  latLng: LatLngTuple; // Note leaflet stores in latitude, longitude (confusingly) rather than the more standard x,y coords
}

export interface AutoSelect {
  geograph?: boolean;
  gpsRoutes?: boolean;
  geodsPOI?: boolean;
  companyData?: boolean;
  postcodes?: boolean;
  streetManager?: boolean;
}

export interface GeneralSettings {
  initialLocation?: InitialLocation;
  mapStyle?: MapStyle;
  customLocation?: CustomLocation;
  initialZoomLevel?: number;
  autoSelect?: AutoSelect;
}

export const DEFAULT_ZOOM_LEVEL = 7;

type UseGeneralSettingsReturnType = [GeneralSettings | undefined, (value: GeneralSettings | undefined) => void];

export function useGeneralSettings(): UseGeneralSettingsReturnType {
  return useLocalStorage<GeneralSettings>("maps.general-settings");
}
