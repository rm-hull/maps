import { LatLngBounds } from "leaflet";

export function getBoundsKey(bounds: LatLngBounds, dp = 3): string {
  return [bounds.getNorthWest(), bounds.getSouthEast()]
    .map((l) => `${l.lat.toFixed(dp)},${l.lng.toFixed(dp)}`)
    .join(":");
}
