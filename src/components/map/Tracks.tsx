import { Polyline, Popup } from "react-leaflet";
// import { Polygon, Polyline, Popup, useMap } from "react-leaflet";
import { useQueryClient } from "react-query";
import { GeoJSONCollection } from "../../services/geojson";
// import { useEffect } from "react";
// import { LatLngTuple } from "leaflet";

// function calculateMidpoint(coordinates: LatLngTuple[]): LatLngTuple {
//   if (coordinates.length === 0) {
//     throw new Error("Coordinates array cannot be empty");
//   }

//   const sum = coordinates.reduce((acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng], [0, 0]);
//   return [sum[0] / coordinates.length, sum[1] / coordinates.length];
// }

export function Tracks() {
  // const map = useMap();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<GeoJSONCollection>(["geojson"]);
  console.log({ data });

  // const latLngs: LatLngTuple[] = data?.features.at(0)?.geometry.coordinates.map(([lng, lat]) => [lat, lng]) ?? [];

  // useEffect(() => {
  //   if (latLngs.length > 0) {
  //     console.log({ latLngs });
  //     const midPoint = calculateMidpoint(latLngs);

  //     map.flyTo(midPoint, map.getZoom());
  //   }
  // }, [latLngs, map]);

  if (data === undefined) {
    return undefined;
  }

  return (
    <>
      {data.features
        .filter((feat) => feat.geometry.type === "LineString")
        .map((feat, index) => (
          <Polyline
            key={index}
            pathOptions={{ color: "purple", weight: 5, lineJoin: "round" }}
            positions={feat.geometry.coordinates.map(([lng, lat]) => [lat, lng]) ?? []}
          >
            <Popup>
              <div>{feat.properties?.name}</div>
            </Popup>
          </Polyline>
        ))}
    </>
  );
}
