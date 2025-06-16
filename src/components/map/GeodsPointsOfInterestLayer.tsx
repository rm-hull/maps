import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { type LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "./ResultPopup";
import { SearchResponse } from "../../services/geods/types";
import { iconFromUrl } from "../../icons";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGeodsPOI } from "../../hooks/useGeodsPOI";

interface SearchHitsProps {
  bounds: LatLngBounds;
}

function PointsOfInterest({ bounds }: SearchHitsProps) {
  const { data, error } = useGeodsPOI(bounds);
  const [cache, setCache] = useState<SearchResponse>();
  useErrorToast("geods-poi-error", "Error loading GeoDS POI", error);

  useEffect(() => {
    if (data) {
      setCache(data);
    }
  }, [data]);


  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {cache?.results?.map((result) => (
        <Marker
          key={result.id}
          position={[result.lat, result.long]}
          icon={iconFromUrl(
            `${import.meta.env.VITE_GEODS_POI_API_URL}v1/poi/marker/${result.categories?.[0] || "unknown"}`
          )}
        >
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
