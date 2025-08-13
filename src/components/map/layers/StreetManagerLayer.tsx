import { PathOptions, type LatLngBounds } from "leaflet";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useStreetManager } from "../../../hooks/useStreetManager";
import { getCoordinates, getObjectRef } from "../../../services/streetManager/types.d";
import WktLayer from "../WktShape";

interface StreetManagerLayerProps {
  bounds: LatLngBounds;
}
const defaultStyle: PathOptions = {
  color: "#FF000077",
  weight: 4,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
};

export function StreetManagerLayer({ bounds }: StreetManagerLayerProps) {
  const { data, error } = useCachedQuery(useStreetManager(bounds));
  useErrorToast("street-manager-error", "Error loading street-manager events", error);

  return (
    <>
      {data?.results.map((result) => (
        <WktLayer
          key={getObjectRef(result)}
          wkt={getCoordinates(result)}
          pathOptions={{ ...defaultStyle, lineJoin: "round", lineCap: "round" }}
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
