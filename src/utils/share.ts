import LZString from "lz-string";
import { type LatLngTuple } from "leaflet";
import { type GeneralSettings } from "@/hooks/useGeneralSettings";

interface ShareState {
  center: LatLngTuple;
  zoom: number;
  settings?: Partial<GeneralSettings>;
  popup?: LatLngTuple;
}

function isLatLngTuple(value: unknown): value is LatLngTuple {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    Number.isFinite(value[0]) &&
    typeof value[1] === "number" &&
    Number.isFinite(value[1])
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isShareState(value: unknown): value is ShareState {
  return (
    isRecord(value) &&
    isLatLngTuple(value.center) &&
    typeof value.zoom === "number" &&
    Number.isFinite(value.zoom) &&
    (value.settings === undefined || isRecord(value.settings)) &&
    (value.popup === undefined || isLatLngTuple(value.popup))
  );
}

export function encodeState(state: ShareState): string {
  const json = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeState(encoded: string): ShareState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const state: unknown = JSON.parse(json);
    return isShareState(state) ? state : null;
  } catch (e) {
    console.error("Failed to decode share state:", e);
    return null;
  }
}
