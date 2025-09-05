import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";

export function ZoomLevel() {
  const [settings] = useGeneralSettings();
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  return (
    <Control position="topleft">
      {settings?.showZoomLevel && (
        <Box
          background="white"
          padding={0}
          borderWidth={2}
          borderColor="rgba(0,0,0,0.2)"
          fontSize="1.2rem"
          fontWeight="bold"
          borderRadius={5}
          width={9}
          height={9}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          {zoom}
        </Box>
      )}
    </Control>
  );
}
