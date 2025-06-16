import * as L from "leaflet";
import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { type LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "./ResultPopup";
import { useCachedQuery } from "../../hooks/useCachedQuery";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGeodsPOI } from "../../hooks/useGeodsPOI";
import { useState } from "react";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function PointsOfInterest({ bounds }: SearchHitsProps) {
  const { data, error } = useCachedQuery(useGeodsPOI(bounds));
  useErrorToast("geods-poi-error", "Error loading GeoDS POI", error);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.results?.map((result) => (
        <Marker key={result.id} position={[result.lat, result.long]} icon={categoryIcon(result.categories?.[0])}>
          <ResultPopup
            title={result.primary_name}
            description={[result.address, result.locality, result.postcode]
              .map((field) => field?.trim())
              .filter((field) => !!field)
              .join(", ")}
            chips={result.categories}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

interface GeodsPointsOfInterestLayerProps {
  minZoom: number;
}

export function GeodsPointsOfInterestLayer({ minZoom }: GeodsPointsOfInterestLayerProps) {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    "GeoDS POI": settings?.autoSelect?.geodsPOI ?? false,
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
    zoomend() {
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

  return <LayerGroup>{overlayChecked["GeoDS POI"] && <PointsOfInterest bounds={bounds} />}</LayerGroup>;
}

function categoryIcon(category?: string): L.Icon {
  const url = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/poi/marker/${category?.toLowerCase() || "unknown"}`;
  const shadowUrl = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/poi/marker/shadow`;
  return new L.Icon({
    popupAnchor: [1, -34],
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    iconUrl: url,
    iconRetinaUrl: url,
    shadowUrl: shadowUrl,
    shadowSize: [51, 37],
    shadowAnchor: [23, 35],
  });
}
