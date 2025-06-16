import * as L from "leaflet";
import markerShadowUrl from "./markers/marker-shadow.png";
import redMarkerUrl from "./markers/marker-icon-2x-red.png";
import violetMarkerUrl from "./markers/marker-icon-2x-violet.png";

const commonProps: L.BaseIconOptions = {
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
} as const;

export const redMarker = new L.Icon({
  ...commonProps,
  iconUrl: redMarkerUrl,
});

export const violetMarker = new L.Icon({
  ...commonProps,
  iconUrl: violetMarkerUrl,
});

