import { VStack, Checkbox } from "@chakra-ui/react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { OVERLAYS } from "../../../config/layer";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";

export function OverlaysControl() {
  const map = useMap();
  const [settings, updateSettings] = useGeneralSettings();
  const [zoom, setZoom] = useState<number>(0);
  const handleOverlayChange = (name: string, checked: boolean) => {
    updateSettings({
      ...settings,
      overlays: {
        ...settings?.overlays,
        [name]: checked,
      },
    });
  };

  useMapEvents({
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  return (
    <VStack align="start" spacing={1}>
      {Object.entries(OVERLAYS).map(([name, cfg]) => (
        <Checkbox
          size="sm"
          isTruncated
          isChecked={settings?.overlays?.[name] ?? false}
          onChange={(e) => handleOverlayChange(name, e.target.checked)}
          key={name}
          isDisabled={zoom > (cfg.maxZoom ?? 17) || zoom <= cfg.minZoom}
        >
          {name}
        </Checkbox>
      ))}
    </VStack>
  );
}
