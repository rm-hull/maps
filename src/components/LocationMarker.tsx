import { Button } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useInterval } from "react-use";

type LocationMarkerProps = {
  onChange?: (latLng: LatLng) => void;
};

export default function LocationMarker({ onChange }: LocationMarkerProps) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      onChange?.(e.latlng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  useInterval(() => {
    map.locate();
  }, 5_000);

  const handleLocate = () => {
    position && map.flyTo(position, map.getZoom());
  };

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>You are here: {position.toString()}</Popup>
        </Marker>
      )}
      <Control prepend position="topright">
        <Button
          color="inherit"
          background="white"
          variant="outline"
          onClick={handleLocate}
          disabled={!position}
          padding={0}
        >
          <IoMdLocate />
        </Button>
      </Control>
    </>
  );
}
