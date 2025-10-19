import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";
import { Control } from "../Control";

export function ZoomLevel() {
  const { settings } = useGeneralSettings();
  const fgColor = useColorModeValue("gray.700", "gray.300");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");

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
          color={fgColor}
          background={bgColor}
          padding={0}
          borderWidth={2}
          borderColor={borderColor}
          fontSize="1.2rem"
          fontWeight="bold"
          borderRadius={4}
          width="35px"
          height="35px"
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
