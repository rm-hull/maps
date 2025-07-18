import { Popup, useMapEvent } from "react-leaflet";
import { type LatLng } from "leaflet";
import { NearestInfo } from "./NearestInfo";
import { useState } from "react";

export function PointOfInterest() {
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
