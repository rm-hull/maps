import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { type LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "./ResultPopup";
import { SearchResponse } from "../../services/gpsRoutes/types";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGpsRoutes } from "../../hooks/useGpsRoutes";
import { useToast } from "@chakra-ui/react";
import { violetMarker } from "../../icons";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function SearchHits({ bounds }: SearchHitsProps) {
  const { data, error } = useGpsRoutes(bounds, true);
  const [cache, setCache] = useState<SearchResponse>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setCache(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        id: "gps-routes-error",
        title: "Error loading GPS routes",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {cache?.hits.map((result) => (
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

interface GpsRoutesLayerProps {
  minZoom: number;
}

export function GpsRoutesLayer({ minZoom }: GpsRoutesLayerProps) {
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
