import { LatLngBounds } from "leaflet";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { OVERLAYS } from "../../config/layer";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import { MapOverlay } from "./MapOverlay";

export function CustomOverlays() {
  const map = useMap();
  const { settings } = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
  });

  const mapZoom = map.getZoom();
  return Object.entries(OVERLAYS).map(
    ([name, overlay]) =>
      settings?.overlays?.[name] &&
      mapZoom > overlay.minZoom &&
      (overlay.maxZoom === undefined || mapZoom <= overlay.maxZoom) && (
        <MapOverlay key={name} name={name}>
          <overlay.component bounds={bounds} />
        </MapOverlay>
      )
  );
}
