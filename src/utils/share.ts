import LZString from "lz-string";
import { type LatLngTuple } from "leaflet";
import { type GeneralSettings } from "@/hooks/useGeneralSettings";

interface ShareState {
  center: LatLngTuple;
  zoom: number;
  settings: Partial<GeneralSettings>;
  popup?: LatLngTuple;
}

export function encodeState(state: ShareState): string {
  const json = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeState(encoded: string): ShareState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode share state:", e);
    return null;
  }
}
