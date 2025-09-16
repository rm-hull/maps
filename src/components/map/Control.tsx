import L from "leaflet";
import { HTMLAttributes, PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";

interface ControlProps {
  position: L.ControlPosition;
  container?: HTMLAttributes<HTMLDivElement>;
  prepend?: boolean;
}

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export const Control = ({ position, container, children, prepend }: PropsWithChildren<ControlProps>) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const positionClass = POSITION_CLASSES[position];
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useMap();

  useEffect(() => {
    const mapContainer = map.getContainer();
    const targetDiv = mapContainer.getElementsByClassName(positionClass)[0] as HTMLElement;
    setPortalRoot(targetDiv || null);
  }, [positionClass, map]);

  // Move the event disabling to happen AFTER the portal renders
  useEffect(() => {
    if (controlContainerRef.current && portalRoot) {
      L.DomEvent.disableClickPropagation(controlContainerRef.current);
      L.DomEvent.disableScrollPropagation(controlContainerRef.current);
      if (prepend) {
        portalRoot.prepend(controlContainerRef.current);
      }
    }
  }, [portalRoot, prepend]); // Depend on portalRoot so it runs after portal is created

  const className = [container?.className, "leaflet-control"].filter(Boolean).join(" ");

  return portalRoot
    ? createPortal(
        <div {...container} ref={controlContainerRef} className={className}>
          {children}
        </div>,
        portalRoot
      )
    : null;
};
