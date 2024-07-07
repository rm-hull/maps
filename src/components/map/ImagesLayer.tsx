import { Image, Link } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { useState, type JSX } from "react";
import { LayerGroup, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
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

  useMapEvent("moveend", () => {
    setLatLng(map.getCenter());
  });

  if (minZoom > map.getZoom()) {
    return null;
  }

  const distance = map.distance(map.getCenter(), map.getBounds().getNorthEast());
  return (
    <LayerGroup>
      <Images latLng={latLng} distance={distance} />
    </LayerGroup>
  );
}
