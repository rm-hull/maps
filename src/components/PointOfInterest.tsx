import { LatLng } from "leaflet";
import { useState } from "react";
import { Popup, useMapEvent } from "react-leaflet";
import NearestInfo from "./NearestInfo";

export default function PointOfInterest() {
  const [position, setPosition] = useState<LatLng | undefined>(undefined);
  useMapEvent("contextmenu", (event) => {
    setPosition(event.latlng);
  });

  if (!position) {
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
