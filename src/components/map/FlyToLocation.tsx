import { type LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyToLocationProps {
  latLng?: LatLngTuple;
}

export function FlyToLocation({ latLng }: FlyToLocationProps): null {
  const map = useMap();

  useEffect(() => {
    if (latLng !== undefined) {
      map.flyTo(latLng, map.getZoom());
    }
  }, [latLng, map]);

  return null;
}
