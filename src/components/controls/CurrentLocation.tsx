import { Button } from "@chakra-ui/react";
import * as L from "leaflet";
import { useEffect, type JSX } from "react";
import { IoMdLocate } from "react-icons/io";
import { Circle, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { NearestInfo } from "../map/NearestInfo";
import redIconUrl from "./marker-icon-2x-red.png";
import shadowIconUrl from "./marker-shadow.png";

interface CurrentLocationProps {
  active?: boolean;
}
const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  shadowUrl: shadowIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function CurrentLocation({ active }: CurrentLocationProps): JSX.Element {
  const { activate, location } = useCurrentLocation();
  useEffect(
    () => {
      if (active === true) {
        activate();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {location.position !== undefined && (
        <>
          <Circle
            center={location.position}
            pathOptions={{ fillColor: "lightblue" }}
            radius={location.accuracy ?? 10}
            stroke={false}
          />
          <Marker position={location.position} opacity={location.active && !location.pending ? 1 : 0.6} icon={redIcon}>
            <NearestInfo
              latLng={location.position}
              accuracy={location.accuracy}
              timestamp={location.timestamp}
              render={(children) => <Popup autoClose={false}>{children}</Popup>}
            />
          </Marker>
        </>
      )}
      <Control prepend position="topright">
        <Button
          background="white"
          variant="outline"
          onClick={activate}
          padding={0}
          borderWidth={2}
          borderColor="rgba(0,0,0,0.2)"
          fontSize="1.5rem"
          color={location.active ? "rgba(240,0,0,0.5)" : "rgba(0,0,0,0.5)"}
          borderRadius={5}
          size="lg"
        >
          <IoMdLocate />
        </Button>
      </Control>
    </>
  );
}
