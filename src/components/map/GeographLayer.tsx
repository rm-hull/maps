import { LayerGroup, Marker, useMap, useMapEvents } from "react-leaflet";
import { type LatLng } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "./ResultPopup";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { useGeograph } from "../../hooks/useGeograph";
import { useState } from "react";

interface ImagesProps {
  latLng: LatLng;
  distance: number;
}

function Images({ latLng, distance }: ImagesProps) {
  const { data, error } = useGeograph(latLng, distance / 1000.0);
  useErrorToast("geograph-error", "Error loading Geograph images", error);

  if (data === undefined || error !== undefined) {
    return null;
  }

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data.map((item) => (
        <Marker key={item.guid} position={[parseFloat(item.lat), parseFloat(item.long)]}>
          <ResultPopup
            title={item.title.replace(/.* : /, "")}
            description={item.description?.replace(/Dist:.+?km.*?<br\/>/, "")}
            imageUrl={item.thumb.replace("_120x120", "")}
            targetUrl={item.link}
            attribution={`[${item.author}, ${item.imageTaken}]`}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

interface GeographLayerProps {
  minZoom: number;
}

export function GeographLayer({ minZoom }: GeographLayerProps) {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [latLng, setLatLng] = useState<LatLng>(map.getCenter());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    Geograph: settings?.autoSelect?.geograph ?? false,
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlayChecked((prevState) => ({
      ...prevState,
      [layer]: checked,
    }));
  };

  useMapEvents({
    moveend() {
      setLatLng(map.getCenter());
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

  const distance = map.distance(map.getCenter(), map.getBounds().getNorthEast()) * 2;

  return <LayerGroup>{overlayChecked.Geograph && <Images latLng={latLng} distance={distance} />}</LayerGroup>;
}
