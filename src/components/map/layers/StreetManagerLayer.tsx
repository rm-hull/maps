import { PathOptions, type LatLngBounds } from "leaflet";
import { GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useStreetManager } from "../../../hooks/useStreetManager";
import { getGeoJSON, getObjectRef } from "../../../services/streetManager/types.d";

interface StreetManagerLayerProps {
  bounds: LatLngBounds;
}
const defaultStyle: PathOptions = {
  color: "#FF0000",
  weight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
};

export function StreetManagerLayer({ bounds }: StreetManagerLayerProps) {
  const { data, error } = useCachedQuery(useStreetManager(bounds));
  useErrorToast("street-manager-error", "Error loading street-manager events", error);

  return (
    <>
      {data?.results.map((result) => (
        <GeoJSON
          key={getObjectRef(result)}
          data={getGeoJSON(result)}
          style={defaultStyle}
          pathOptions={{ lineJoin: "round", lineCap: "round" }}
        />
        // <Marker key={getObjectRef(result)} position={[result._geoloc.lat, result._geoloc.lng]} icon={violetMarker}>
        //   <ResultPopup
        //     title={result.title}
        //     description={result.description}
        //     imageUrl={result.headline_image_url}
        //     targetUrl={`https://www.destructuring-bind.org/gps-routes/${result.ref}`}
        //     distanceKm={result.distance_km}
        //   />
        // </Marker>
      ))}
    </>
  );
}
