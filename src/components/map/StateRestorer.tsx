import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { decodeState } from "@/utils/share";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";

export function StateRestorer() {
  const map = useMap();
  const [searchParams] = useSearchParams();
  const { settings, updateSettings } = useGeneralSettings();
  const sharedStateEncoded = searchParams.get("s");

  useEffect(() => {
    if (!sharedStateEncoded) return;

    const state = decodeState(sharedStateEncoded);
    if (!state) return;

    if (state.center && state.zoom) {
      map.setView(state.center, state.zoom);
    }

    const newSettings = { ...settings };
    if (state.popup) {
      newSettings.activePopupLocation = state.popup;
    }
    if (state.settings) {
      Object.assign(newSettings, state.settings);
    }
    if (state.popup || state.settings) {
      updateSettings(newSettings);
    }
  }, [map, sharedStateEncoded]);

  return null;
}
