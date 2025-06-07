import { type LatLng } from "leaflet";
import { useState, type JSX } from "react";
import { Popup, useMapEvent } from "react-leaflet";
import { NearestInfo } from "./NearestInfo";

export function PointOfInterest(): JSX.Element | null {
  const [position, setPosition] = useState<LatLng>();
  useMapEvent("contextmenu", (event) => {
    setPosition(event.latlng);
  });

  if (position === undefined) {
    return null;
  }

  return (
    <NearestInfo
      latLng={position}
      render={(children) => (
        <Popup position={position} autoClose={false}>
          {children}
        </Popup>
      )}
    />
  );
}
