import { Image, Link } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { useState } from "react";
import { Circle, FeatureGroup, LayerGroup, Popup, useMap, useMapEvent } from "react-leaflet";
import { Link as BrowserLink } from "react-router-dom";
import useImages from "../hooks/useImages";

type ImagesProps = {
  latLng: LatLng;
  distance: number;
};

function Images({ latLng, distance }: ImagesProps) {
  const { data, status } = useImages(latLng, distance / 1000.0);

  return (
    <>
      {status === "success" &&
        data.items.map((item) => (
          <FeatureGroup key={item.guid}>
            <Popup>
              <Link as={BrowserLink} to={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </Link>
              <div dangerouslySetInnerHTML={{ __html: item.description?.replace(/Dist:.+?km<br\/>/, "") }} />
              <Image src={item.thumb.replace("_120x120", "")} />[{item.author}, {item.imageTaken}]
            </Popup>
            <Circle center={[parseFloat(item.lat), parseFloat(item.long)]} radius={10} pathOptions={{ color: "red" }} />
          </FeatureGroup>
        ))}
    </>
  );
}

type ImagesLayerProps = {
  minZoom: number;
};

export default function ImagesLayer({ minZoom }: ImagesLayerProps) {
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
