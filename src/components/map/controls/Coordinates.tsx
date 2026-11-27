import { type ControlPosition, type LatLng } from "leaflet";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { Control } from "../Control";

export type CoordinatesFormat = "decimal" | "minutes";

interface CoordinatesProps {
  format?: CoordinatesFormat;
  position: ControlPosition;
}

function formatCoordinate(value: number, axis: "latitude" | "longitude", format: CoordinatesFormat) {
  const direction = axis === "latitude" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E";
  const absoluteValue = Math.abs(value);

  if (format === "minutes") {
    const totalThousandthsOfMinutes = Math.round(absoluteValue * 60 * 1000);
    const degrees = Math.floor(totalThousandthsOfMinutes / 60000);
    const minutes = ((totalThousandthsOfMinutes % 60000) / 1000).toFixed(3);
    return `${degrees}° ${minutes}′ ${direction}`;
  }

  return `${absoluteValue.toFixed(5)}° ${direction}`;
}

export function Coordinates({ format = "minutes", position }: CoordinatesProps) {
  const map = useMap();
  const [latLng, setLatLng] = useState<LatLng>(map.getCenter());

  useMapEvents({
    mousemove(event) {
      setLatLng(event.latlng);
    },
  });

  const latitude = formatCoordinate(latLng.lat, "latitude", format);
  const longitude = formatCoordinate(latLng.lng, "longitude", format);

  return (
    <Control position={position} prepend container={{ className: "coordinate-control" }}>
      <div>Lat: {latitude}</div>
      <div>Lng: {longitude}</div>
    </Control>
  );
}