import { Button } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import NearestInfo from "./NearestInfo";

type LocationDetails = {
  position?: LatLng;
  accuracy?: number;
  timestamp?: number;
  active: boolean;
  pending: boolean;
  cancelTimerId?: NodeJS.Timeout;
};

export default function CurrentLocation() {
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    active: false,
    pending: true,
  });
  const map = useMapEvents({
    locationfound(event) {
      if (locationDetails.pending) {
        map.flyTo(event.latlng, map.getZoom());
      }

      setLocationDetails((prev) => ({
        ...prev,
        pending: false,
        position: event.latlng,
        accuracy: event.accuracy,
        timestamp: event.timestamp,
      }));
    },
  });

  const activate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    map.locate({ enableHighAccuracy: true, watch: true });

    clearTimeout(locationDetails.cancelTimerId);
    const timerId = setTimeout(() => {
      map.stopLocate();
      setLocationDetails((prev) => ({ ...prev, active: false }));
    }, 180_000);

    setLocationDetails((prev) => ({
      ...prev,
      pending: true,
      active: true,
      cancelTimerId: timerId,
    }));
  };

  return (
    <>
      {locationDetails.position && (
        <>
          <Circle
            center={locationDetails.position}
            pathOptions={{ fillColor: "lightblue" }}
            radius={locationDetails.accuracy}
            stroke={false}
          />
          <Marker
            position={locationDetails.position}
            opacity={locationDetails.active && !locationDetails.pending ? 1 : 0.6}
          >
            <NearestInfo
              latLng={locationDetails.position}
              accuracy={locationDetails.accuracy}
              timestamp={locationDetails.timestamp}
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
          borderColor="rgba(0,0,0,0.25)"
          fontSize="1.5rem"
          color={locationDetails.active ? "rgba(240,0,0,0.5)" : "rgba(0,0,0,0.5)"}
          borderRadius={5}
          size="lg"
        >
          <IoMdLocate />
        </Button>
      </Control>
    </>
  );
}
