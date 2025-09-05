import { type LatLngTuple } from "leaflet";
import { useLocalStorage } from "./useLocalStorage";

export type InitialLocation = "default" | "current" | "custom";

export interface CustomLocation {
  searchTerm: string;
  latLng: LatLngTuple; // Note leaflet stores in latitude, longitude (confusingly) rather than the more standard x,y coords
}

export interface GeneralSettings {
  initialLocation?: InitialLocation;
  mapStyle?: string;
  customLocation?: CustomLocation;
  initialZoomLevel?: number;
  showZoomLevel?: boolean;
  overlays?: Record<string, boolean>;
}

export const DEFAULT_ZOOM_LEVEL = 13;

type UseGeneralSettingsReturnType = [GeneralSettings | undefined, (value: GeneralSettings | undefined) => void];

export function useGeneralSettings(): UseGeneralSettingsReturnType {
  return useLocalStorage<GeneralSettings>("maps.general-settings");
}
