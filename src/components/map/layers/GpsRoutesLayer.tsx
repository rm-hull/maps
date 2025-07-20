import { type LatLngBounds } from "leaflet";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGpsRoutes } from "../../../hooks/useGpsRoutes";
import { violetMarker } from "../../../icons";
import ResultPopup from "../ResultPopup";

interface GpsRoutesLayerProps {
  bounds: LatLngBounds;
}

export function GpsRoutesLayer({ bounds }: GpsRoutesLayerProps) {
  const { data, error } = useCachedQuery(useGpsRoutes(bounds, true));
  useErrorToast("gps-routes-error", "Error loading GPS routes", error);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.hits.map((result) => (
        <Marker key={result.objectID} position={[result._geoloc.lat, result._geoloc.lng]} icon={violetMarker}>
          <ResultPopup
            title={result.title}
            description={result.description}
            imageUrl={result.headline_image_url}
            targetUrl={`https://www.destructuring-bind.org/gps-routes/${result.ref}`}
            distanceKm={result.distance_km}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
