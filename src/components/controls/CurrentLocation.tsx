import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdLocate } from "react-icons/io";
import { Circle, Marker, Popup } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { locateIcon } from "../../icons";
import { NearestInfo } from "../map/NearestInfo";

interface CurrentLocationProps {
  active?: boolean;
}

export function CurrentLocation({ active }: CurrentLocationProps) {
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
          <Marker
            position={location.position}
            opacity={location.active && !location.pending ? 1 : 0.6}
            icon={locateIcon(location.active && !location.pending ? "rgba(240,0,0,0.6)" : "rgba(240,0,0,0.4)")}
          >
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
