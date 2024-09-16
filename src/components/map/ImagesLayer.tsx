import { Image, Link } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { useState, type JSX } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Link as ReactRouterLink } from "react-router-dom";
import { useImages } from "../../hooks/useImages";

interface ImagesProps {
  latLng: LatLng;
  distance: number;
}

function Images({ latLng, distance }: ImagesProps): JSX.Element {
  const { data, status } = useImages(latLng, distance / 1000.0);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
      {status === "success" &&
        data.map((item) => (
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

interface ImagesLayerProps {
  minZoom: number;
}

export function ImagesLayer({ minZoom }: ImagesLayerProps): JSX.Element | null {
  const map = useMap();
  const [latLng, setLatLng] = useState<LatLng>(map.getCenter());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({});
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

  if (map.getZoom() < minZoom || !overlayChecked.Geograph) {
    return null;
  }

  const distance = map.distance(map.getCenter(), map.getBounds().getNorthEast());
  return <Images latLng={latLng} distance={distance} />;
}
