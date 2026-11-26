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

    map.setView(state.center, state.zoom);

    if (state.settings) {
      updateSettings({ ...settings, ...state.settings });
    }
  }, [map, sharedStateEncoded]);

  return null;
}
