import { Box } from "@chakra-ui/react";
import { type ControlPosition, type LatLng } from "leaflet";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { toBNG } from "../../../services/osdatahub/helpers";
import { Control } from "../Control";

export type CoordinatesFormat = "latlng-decimal" | "latlng-minutes" | "bng";
type LatLngCoordinatesFormat = Exclude<CoordinatesFormat, "bng">;

interface CoordinatesProps {
  format?: CoordinatesFormat;
  position: ControlPosition;
}

function formatCoordinate(value: number, axis: "latitude" | "longitude", format: LatLngCoordinatesFormat) {
  const direction = axis === "latitude" ? (value < 0 ? "S" : "N") : value < 0 ? "W" : "E";
  const absoluteValue = Math.abs(value);

  if (format === "latlng-minutes") {
    const totalThousandthsOfMinutes = Math.round(absoluteValue * 60 * 1000);
    const degrees = Math.floor(totalThousandthsOfMinutes / 60000);
    const minutes = ((totalThousandthsOfMinutes % 60000) / 1000).toFixed(3);
    return `${degrees}° ${minutes}′ ${direction}`;
  }

  return `${absoluteValue.toFixed(5)}° ${direction}`;
}

export function Coordinates({ format = "latlng-minutes", position }: CoordinatesProps) {
  const map = useMap();
  const [latLng, setLatLng] = useState<LatLng>(map.getCenter());

  useMapEvents({
    mousemove(event) {
      setLatLng(event.latlng);
    },
  });

  const bng = format === "bng" ? toBNG(latLng) : undefined;

  const coordinates =
    format === "bng" ? (
      <>
        <Box>Easting: {bng?.[0]}</Box>
        <Box>Northing: {bng?.[1]}</Box>
      </>
    ) : (
      <>
        <Box>Lat: {formatCoordinate(latLng.lat, "latitude", format)}</Box>
        <Box>Lng: {formatCoordinate(latLng.lng, "longitude", format)}</Box>
      </>
    );

  return (
    <Control position={position} prepend container={{ className: "coordinate-control" }}>
      {coordinates}
    </Control>
  );
}
