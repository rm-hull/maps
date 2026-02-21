import * as L from "leaflet";
import blueMarkerUrl from "./markers/marker-icon-2x-blue.png";
import greenMarkerUrl from "./markers/marker-icon-2x-green.png";
import redMarkerUrl from "./markers/marker-icon-2x-red.png";
import violetMarkerUrl from "./markers/marker-icon-2x-violet.png";
import markerShadowUrl from "./markers/marker-shadow.png";
import gasStationUrl from "./gas-station.webp";

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

export const blueMarker = new L.Icon({
  ...commonProps,
  iconUrl: blueMarkerUrl,
});

export const greenMarker = new L.Icon({
  ...commonProps,
  iconUrl: greenMarkerUrl,
});

export const gasStation = new L.Icon({
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [1, -28],
  iconUrl: gasStationUrl,
});

export function gasStationWithRing(colors?: string[]): L.DivIcon {
  const imgSize = 28;
  const gap = 1; // px gap around the image
  const strokeWidth = 6; // thicker ring

  // radius so inner edge of stroke sits `gap` pixels away from image edge
  const r = Math.floor(imgSize / 2 + gap + strokeWidth / 2);
  const ringSize = 2 * r + strokeWidth;
  const cx = Math.floor(ringSize / 2);
  const cy = Math.floor(ringSize / 2);

  const svgParts: string[] = [];

  if (!colors || colors.length === 0) {
    // no ring
  } else if (colors.length === 1) {
    const c = colors[0];
    svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${strokeWidth}" />`);
  } else {
    // two colors -> draw two semicircles
    const c1 = colors[0];
    const c2 = colors[1];
    const circumference = 2 * Math.PI * r;
    const half = circumference / 2;

    // draw two circles with stroke-dasharray to show halves, rotated so split is vertical
    svgParts.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c1}" stroke-width="${strokeWidth}" stroke-dasharray="${half} ${half}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt" />`
    );
    svgParts.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c2}" stroke-width="${strokeWidth}" stroke-dasharray="${half} ${half}" stroke-dashoffset="${half}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt" />`
    );
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${ringSize}" height="${ringSize}" viewBox="0 0 ${ringSize} ${ringSize}" style="position:absolute;left:0;top:0;pointer-events:none">
      ${svgParts.join("\n")}
    </svg>
  `;

  const html = `
    <div style="position:relative;width:${ringSize}px;height:${ringSize}px">
      <img src="${gasStationUrl}" style="position:absolute;left:${Math.floor((ringSize - imgSize) / 2)}px;top:${Math.floor((ringSize - imgSize) / 2)}px;width:${imgSize}px;height:${imgSize}px;display:block;" />
      ${svg}
    </div>
  `;

  return L.divIcon({
    html,
    className: "", // avoid default leaflet styles
    iconSize: [ringSize, ringSize],
    // anchor so the bottom of the gas-station image aligns with the marker point
    iconAnchor: [Math.floor(ringSize / 2), Math.floor((ringSize + imgSize) / 2)],
    popupAnchor: [1, -Math.floor((ringSize + imgSize) / 2)],
  });
}

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

export function locateIcon(color: string, className?: string): L.DivIcon {
  const svg = `
    <svg fill="${color}" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="${className ?? ""}">
      <path d="M256 176c-44.004 0-80.001 36-80.001 80 0 44.004 35.997 80 80.001 80 44.005 0 79.999-35.996 79.999-80 0-44-35.994-80-79.999-80zm190.938 58.667c-9.605-88.531-81.074-160-169.605-169.599V32h-42.666v33.067c-88.531 9.599-160 81.068-169.604 169.599H32v42.667h33.062c9.604 88.531 81.072 160 169.604 169.604V480h42.666v-33.062c88.531-9.604 160-81.073 169.605-169.604H480v-42.667h-33.062zM256 405.333c-82.137 0-149.334-67.198-149.334-149.333 0-82.136 67.197-149.333 149.334-149.333 82.135 0 149.332 67.198 149.332 149.333S338.135 405.333 256 405.333z"></path>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "", // disable default leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
