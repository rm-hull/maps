import { PathProps } from "@react-leaflet/core";
import { wktToGeoJSON } from "@terraformer/wkt";
import { PropsWithChildren } from "react";
import { CircleMarker, Polyline, Polygon } from "react-leaflet";
import { toLatLng } from "../../services/osdatahub/helpers";

type WktShapeProps = {
  wkt?: string;
} & PathProps;

export default function WktShape({ wkt, children, ...props }: PropsWithChildren<WktShapeProps>) {
  if (!wkt) return null;

  const geojson = wktToGeoJSON(wkt);

  if (!geojson) return null;

  switch (geojson.type) {
    case "Point": {
      return (
        <CircleMarker center={toLatLng(geojson.coordinates)} radius={8} {...props}>
          {children}
        </CircleMarker>
      );
    }
    case "LineString": {
      return (
        <Polyline positions={geojson.coordinates.map(toLatLng)} {...props}>
          {children}
        </Polyline>
      );
    }
    case "Polygon": {
      return (
        <Polygon positions={geojson.coordinates.map((ring) => ring.map(toLatLng))} {...props}>
          {children}
        </Polygon>
      );
    }
    default:
      console.warn("Unsupported WKT type:", geojson.type);
      return null;
  }
}
