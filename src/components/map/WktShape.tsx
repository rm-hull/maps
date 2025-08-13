import { PathProps } from "@react-leaflet/core";
import { wktToGeoJSON } from "@terraformer/wkt";
import { PropsWithChildren } from "react";
import { CircleMarker, Polyline, Polygon } from "react-leaflet";
import { toLatLng } from "../../services/osdatahub/helpers";

type WktShapeProps = {
  wkt?: string;
} & PathProps;

export default function WktLayer({ wkt, children, ...props }: PropsWithChildren<WktShapeProps>) {
  if (!wkt) return null;

  const geojson = wktToGeoJSON(wkt);

  if (!geojson) return null;

  switch (geojson.type) {
    case "Point": {
      const [e, n] = geojson.coordinates;
      const latlng = toLatLng([e, n]);
      return (
        <CircleMarker center={latlng} radius={8} {...props}>
          {children}
        </CircleMarker>
      );
    }
    case "LineString": {
      const latlngs = geojson.coordinates.map(toLatLng);
      return (
        <Polyline positions={latlngs} {...props}>
          {children}
        </Polyline>
      );
    }
    case "Polygon": {
      const latlngs = geojson.coordinates.map((ring) => ring.map(toLatLng));
      return (
        <Polygon positions={latlngs} {...props}>
          {children}
        </Polygon>
      );
    }
    default:
      console.warn("Unsupported WKT type:", geojson.type);
      return null;
  }
}
