import { type LatLngTuple } from "leaflet";
import { useLocalStorage } from "./useLocalStorage";

export type InitialLocation = "default" | "current" | "custom";

export type MapStyle = "leisure" | "roads" | "outdoor" | "light";

export interface CustomLocation {
  searchTerm: string;
  latLng: LatLngTuple;
}

export interface GeneralSettings {
  initialLocation?: InitialLocation;
  mapStyle?: MapStyle;
  customLocation?: CustomLocation;
}

type UseGeneralSettingsReturnType = [GeneralSettings | undefined, (value: GeneralSettings | undefined) => void];

export function useGeneralSettings(): UseGeneralSettingsReturnType {
  return useLocalStorage<GeneralSettings>("maps.general-settings");
}
