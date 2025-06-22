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

export function countIcon(color: string, count: number): L.DivIcon {
  const radius = 16;
  const strokeWidth = 2;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${radius * 2}" height="${radius * 2}">
      <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth}" fill="${color}" fill-opacity="0.4" stroke="${color}" stroke-width="${strokeWidth}" />
      <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#555" font-size="16" font-family="sans-serif" dy=".12em">${count}</text>
    </svg>
  `;
  return new L.DivIcon({
    className: "custom-count-icon",
    html: svg,
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
  });
}
