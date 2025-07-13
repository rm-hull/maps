import { LayerGroup, LayersControl, useMap, useMapEvents } from "react-leaflet";
import { PropsWithChildren, useState } from "react";
import { CompanyDataLayer } from "./layers/CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "./layers/GeodsPointsOfInterestLayer";
import { GeographLayer } from "./layers/GeographLayer";
import { GpsRoutesLayer } from "./layers/GpsRoutesLayer";
import { LatLngBounds } from "leaflet";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";
import PostcodePolygonsLayer from "./layers/PostcodePolygonsLayer";

type CustomLayerGroupProps = {
  enabled?: boolean;
  minZoom: number;
};

function CustomLayerGroup({ enabled, minZoom, children }: PropsWithChildren<CustomLayerGroupProps>) {
  const map = useMap();

  if (map.getZoom() < minZoom) {
    return null;
  }

  return <LayerGroup>{enabled && children}</LayerGroup>;
}

type Overlay = {
  minZoom: number;
  component: React.ComponentType<{ bounds: LatLngBounds }>;
  checked?: boolean;
};

export function CustomLayers() {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlay, setOverlay] = useState<Record<string, Overlay>>({
    "GPS Routes": { minZoom: 5, component: GpsRoutesLayer, checked: settings?.autoSelect?.gpsRoutes },
    Geograph: { minZoom: 10, component: GeographLayer, checked: settings?.autoSelect?.geograph },
    "GeoDS POI": { minZoom: 8, component: GeodsPointsOfInterestLayer, checked: settings?.autoSelect?.geodsPOI },
    "Company Data": { minZoom: 10, component: CompanyDataLayer, checked: settings?.autoSelect?.companyData },
    Postcodes: { minZoom: 5, component: PostcodePolygonsLayer, checked: settings?.autoSelect?.postcodes },
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlay((prevState) => ({
      ...prevState,
      [layer]: {
        ...prevState[layer],
        checked,
      },
    }));
  };

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
    zoomend() {
      setBounds(map.getBounds());
    },
    overlayadd(event) {
      handleOverlayChange(event.name, true);
    },
    overlayremove(event) {
      handleOverlayChange(event.name, false);
    },
  });

  return Object.entries(overlay).map(([name, overlay]) => (
    <LayersControl.Overlay key={name} name={name} checked={overlay.checked}>
      <CustomLayerGroup enabled={overlay.checked} minZoom={overlay.minZoom}>
        <overlay.component bounds={bounds} />
      </CustomLayerGroup>
    </LayersControl.Overlay>
  ));
}
