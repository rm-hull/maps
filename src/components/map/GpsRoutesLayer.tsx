import { type LatLngBounds } from "leaflet";
import { useEffect, useState, type JSX } from "react";
import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGpsRoutes } from "../../hooks/useGpsRoutes";
import MarkerClusterGroup from "react-leaflet-cluster";
import SearchHit from "./SearchHit";
import { violetMarker } from "../../icons";
import { SearchResponse } from "../../services/gpsRoutes/types";
import { useToast } from "@chakra-ui/react";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function SearchHits({ bounds }: SearchHitsProps): JSX.Element | null {
  const { data, error } = useGpsRoutes(bounds, true);
  const [cache, setCache] = useState<SearchResponse>();
  const toast = useToast();

  useEffect(() => {
    if (data && data.hits.length > 0) {
      setCache(data);
    }
  }, [data]);

  if (error) {
    toast({
      id: "gps-routes-error",
      title: "Error loading GPS routes",
      description: error.message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });

    return null;
  }

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {cache?.hits.map((result) => (
        <Marker key={result.objectID} position={[result._geoloc.lat, result._geoloc.lng]} icon={violetMarker}>
          <SearchHit
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
