import { type LatLngBounds } from "leaflet";
import { useState, type JSX } from "react";
import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGpsRoutes } from "../../hooks/useGpsRoutes";
import MarkerClusterGroup from "react-leaflet-cluster";
import SearchHit from "./SearchHit";
import { violetMarker } from "../../icons";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function SearchHits({ bounds }: SearchHitsProps): JSX.Element | null {
  const { data, isLoading, error } = useGpsRoutes(bounds, true);

  if (isLoading || error) {
    return null;
  }

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.hits.map((result) => (
        <Marker key={result.objectID} position={[result._geoloc.lat, result._geoloc.lng]} icon={violetMarker}>
          <SearchHit
            title={result.title}
            description={result.description}
            imageUrl={result.headline_image_url}
            targetUrl={`/gps-routes/${result.ref}`}
            distanceKm={result.distance_km}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

interface GpsRoutesLayerProps {
  minZoom: number;
}

export function GpsRoutesLayer({ minZoom }: GpsRoutesLayerProps): JSX.Element | null {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    "GPS Routes": settings?.autoSelect?.gpsRoutes ?? false,
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlayChecked((prevState) => ({
      ...prevState,
      [layer]: checked,
    }));
  };

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
    overlayadd(event) {
      handleOverlayChange(event.name, true);
    },
    overlayremove(event) {
      handleOverlayChange(event.name, false);
    },
  });

  if (map.getZoom() < minZoom) {
    return null;
  }

  return <LayerGroup>{overlayChecked["GPS Routes"] && <SearchHits bounds={bounds} />}</LayerGroup>;
}
