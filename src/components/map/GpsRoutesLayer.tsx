import { Image, Link, Text } from "@chakra-ui/react";
import { type LatLngBounds } from "leaflet";
import { useState, type JSX } from "react";
import { LayerGroup, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Link as ReactRouterLink } from "react-router-dom";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGpsRoutes } from "../../hooks/useGpsRoutes";
import MarkerClusterGroup from "react-leaflet-cluster";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function SearchHits({ bounds }: SearchHitsProps): JSX.Element | null {
  const { data, isLoading, error } = useGpsRoutes(bounds, true);

  // if (isLoading || error) {
  //   return null;
  // }

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.hits.map((result) => (
        <Marker key={result.objectID} position={[result._geoloc.lat, result._geoloc.lng]}>
          <Popup maxWidth={400}>
            <Link as={ReactRouterLink} to={result.ref} target="_blank" rel="noreferrer">
              <Image src={result.headline_image_url} />
              <Text variant="h2">{result.title}</Text>
              <Text variant="body">{result.description}</Text>
            </Link>
          </Popup>
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
