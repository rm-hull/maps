import useLocalStorage from "./useLocalStorage";

export type InitialLocation = "default" | "current" | "random";

export type MapStyle = "leisure" | "roads" | "outdoor" | "light";

export interface GeneralSettings {
  initialLocation?: InitialLocation;
  mapStyle?: MapStyle;
}

type UseGeneralSettingsReturnType = [GeneralSettings | undefined, (value: GeneralSettings | undefined) => void];

export default function useGeneralSettings(): UseGeneralSettingsReturnType {
  return useLocalStorage<GeneralSettings>("maps.general-settings");
}
