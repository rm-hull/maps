import { Box } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";

type MapOverlayProps = {
  name: string;
  className?: string;
  zIndex?: number
};

export const MapOverlay = ({ children, name, className = "", zIndex }: PropsWithChildren<MapOverlayProps>) => {
  const map = useMap();
  const [pane, setPane] = useState<HTMLElement | undefined>();

  useEffect(() => {
    const overlayPane = map.createPane(name);
    overlayPane.style.zIndex = "650"; // Above tiles, below controls
    overlayPane.style.pointerEvents = "none";

    queueMicrotask(() => setPane(overlayPane));

    return () => {
      if (overlayPane && overlayPane.parentNode) {
        overlayPane.parentNode.removeChild(overlayPane);
      }
    };
  }, [map, name]);

  return pane
    ? createPortal(
        <Box className={className} pointerEvents="auto" zIndex={zIndex}>
          {children}
        </Box>,
        pane
      )
    : null;
};
