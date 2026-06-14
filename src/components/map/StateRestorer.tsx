import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { decodeState } from "@/utils/share";

export function StateRestorer() {
  const map = useMap();
  const [searchParams] = useSearchParams();
  const sharedStateEncoded = searchParams.get("s");

  useEffect(() => {
    if (!sharedStateEncoded) return;

    const state = decodeState(sharedStateEncoded);
    if (!state) return;

    if (state.center && state.zoom) {
      map.setView(state.center, state.zoom);
    }

    if (state.popup) {
      // We can't easily "open" a popup that is managed by another component 
      // unless we have a way to trigger it. 
      // But for now, we can at least center the map on it if it's far away.
      // Or we can try to find the POI at that location.
    }
  }, [map, sharedStateEncoded]);

  return null;
}
