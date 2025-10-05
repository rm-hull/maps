import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoMdLocate } from "react-icons/io";
import { Circle, Marker } from "react-leaflet";
import { useCurrentLocation } from "../../../hooks/useCurrentLocation";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { locateIcon } from "../../../icons";
import { Control } from "../Control";
import { NearestInfo } from "../NearestInfo";
import { PopupPassthrough } from "../PopupPassthrough";

interface CurrentLocationProps {
  active?: boolean;
}

export function CurrentLocation({ active }: CurrentLocationProps) {
  const { activate, location } = useCurrentLocation();
  useEffect(() => {
    if (active === true) {
      activate();
    }
  }, [active]);

  useErrorToast("gps-error", "Error determining GPS location", location.error);

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
            icon={locateIcon(`rgba(240,0,0,${location.active && !location.pending ? 0.6 : 0.4})`)}
          >
            <NearestInfo
              latLng={location.position}
              accuracy={location.accuracy}
              timestamp={location.timestamp}
              render={PopupPassthrough}
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
          color={location.active ? "rgba(240,0,0,0.6)" : "rgba(0,0,0,0.5)"}
          borderRadius={5}
          size="lg"
        >
          <IoMdLocate />
        </Button>
      </Control>
    </>
  );
}
