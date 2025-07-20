import { Feature } from "geojson";
import { useEffect } from "react";
import { Polyline, Popup, useMap } from "react-leaflet";
import { useQueryClient } from "react-query";
import { GeoJSONCollection } from "../../services/geojson";

const lineString = (feat: Feature): boolean => feat.geometry.type === "LineString";

export function Tracks() {
  const map = useMap();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<GeoJSONCollection>(["geojson"]);

  useEffect(() => {
    if (data !== undefined) {
      const [lng, lat] = data?.features.find(lineString)?.geometry.coordinates.at(0) ?? [];
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [data, map]);

  if (data === undefined) {
    return undefined;
  }

  return (
    <>
      {data.features.filter(lineString).map((feat, index) => (
        <Polyline
          key={index}
          pathOptions={{ color: "purple", opacity: 0.6, weight: 5, lineJoin: "round" }}
          positions={feat.geometry.coordinates.map(([lng, lat]) => [lat, lng]) ?? []}
        >
          <Popup>{feat.properties?.name}</Popup>
        </Polyline>
      ))}
    </>
  );
}
