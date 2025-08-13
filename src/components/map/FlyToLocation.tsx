import { type LatLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyToLocationProps {
  latLng?: LatLng;
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
