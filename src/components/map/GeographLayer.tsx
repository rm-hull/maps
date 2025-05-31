import { Image, Link } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { useState, type JSX } from "react";
import { LayerGroup, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Link as ReactRouterLink } from "react-router-dom";
import { useImages } from "../../hooks/useImages";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";

interface ImagesProps {
  latLng: LatLng;
  distance: number;
}

function Images({ latLng, distance }: ImagesProps): JSX.Element {
  const data = useImages(latLng, distance / 1000.0);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data.map((item) => (
        <Marker key={item.guid} position={[parseFloat(item.lat), parseFloat(item.long)]}>
          <Popup maxWidth={400}>
            <Link as={ReactRouterLink} to={item.link} target="_blank" rel="noreferrer">
              {item.title}
            </Link>
            <div dangerouslySetInnerHTML={{ __html: item.description?.replace(/Dist:.+?km<br\/>/, "") }} />
            <Image src={item.thumb.replace("_120x120", "")} />[{item.author}, {item.imageTaken}]
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

interface GeographLayerProps {
  minZoom: number;
}

export function GeographLayer({ minZoom }: GeographLayerProps): JSX.Element | null {
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
