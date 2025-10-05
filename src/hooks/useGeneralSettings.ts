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
  maxSearchResults?: number;
  gpsActiveDuration?: number;
}

export const DEFAULT_ZOOM_LEVEL = 13;
export const DEFAULT_GPS_ACTIVE_DURATION = 180_000; // 3 minutes

type UseGeneralSettingsReturnType = {
  settings: GeneralSettings | undefined;
  updateSettings: (value: GeneralSettings | undefined) => void;
  isLoading: boolean;
};

export function useGeneralSettings(): UseGeneralSettingsReturnType {
  const { value, setValue, isLoading } = useLocalStorage<GeneralSettings>("maps.general-settings");
  return {
    settings: value,
    updateSettings: setValue,
    isLoading,
  };
}
