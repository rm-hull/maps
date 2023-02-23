import { Button } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useInterval } from "react-use";
import NearestInfo from "./NearestInfo";

type LocationDetails = {
  position?: LatLng;
  lastUpdated: number;
  active: boolean;
  pending: boolean;
  cancelTimerId?: NodeJS.Timeout;
};

export default function CurrentLocation() {
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    active: false,
    pending: true,
    lastUpdated: Date.now(),
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
        lastUpdated: Date.now(),
      }));
    },
  });

  useInterval(() => {
    if (locationDetails.active) {
      map.locate();
    }
  }, 10_000);

  const activate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    map.locate();

    clearTimeout(locationDetails.cancelTimerId);
    const timerId = setTimeout(() => {
      setLocationDetails((prev) => ({ ...prev, active: false }));
    }, 120_000);

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
        <Marker
          position={locationDetails.position}
          opacity={locationDetails.active && !locationDetails.pending ? 1 : 0.6}
        >
          <NearestInfo latLng={locationDetails.position} render={(children) => <Popup>{children}</Popup>} />
        </Marker>
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
