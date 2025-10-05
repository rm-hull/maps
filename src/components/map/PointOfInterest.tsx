import { type LatLng } from "leaflet";
import { useState } from "react";
import { useMapEvent } from "react-leaflet";
import { NearestInfo } from "./NearestInfo";
import { PopupPassthrough } from "./PopupPassthrough";

export function PointOfInterest() {
  const [position, setPosition] = useState<LatLng>();
  useMapEvent("contextmenu", (event) => {
    setPosition(event.latlng);
  });

  if (position === undefined) {
    return null;
  }

  return <NearestInfo latLng={position} render={PopupPassthrough} />;
}
