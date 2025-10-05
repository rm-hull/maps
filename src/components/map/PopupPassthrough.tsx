import { LatLng } from "leaflet";
import { ReactNode } from "react";
import { Popup } from "react-leaflet";

export function PopupPassthrough(children: ReactNode, position: LatLng) {
  return (
    <Popup position={position} autoClose={false} closeButton={false}>
      {children}
    </Popup>
  );
}
