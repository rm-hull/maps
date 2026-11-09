import { LatLng } from "leaflet";
import { ReactNode } from "react";
import { Popup } from "./Popup";

export function PopupPassthrough(children: ReactNode, position: LatLng) {
  return (
    <Popup position={position} autoClose={false} closeButton={false}>
      {children}
    </Popup>
  );
}
