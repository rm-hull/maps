import { type LatLngTuple } from "leaflet";
import { useLocalStorage } from "./useLocalStorage";

export type InitialLocation = "default" | "current" | "custom";

export type MapStyle = "leisure" | "roads" | "outdoor" | "light";

export interface CustomLocation {
  searchTerm: string;
  latLng: LatLngTuple;
}

export interface AutoSelect {
  geograph?: boolean;
  gpsRoutes?: boolean;
  geodsPOI?: boolean;
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
