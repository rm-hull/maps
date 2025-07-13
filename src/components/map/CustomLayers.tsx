import { LayerGroup, LayersControl, useMap, useMapEvents } from "react-leaflet";
import { PropsWithChildren, useState } from "react";
import { CompanyDataLayer } from "./layers/CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "./layers/GeodsPointsOfInterestLayer";
import { GeographLayer } from "./layers/GeographLayer";
import { GpsRoutesLayer } from "./layers/GpsRoutesLayer";
import { LatLngBounds } from "leaflet";
import { useGeneralSettings } from "../../hooks/useGeneralSettings";

type Overlay = "GPS Routes" | "Geograph" | "GeoDS POI" | "Company Data";

// type X = {
//   name: string;
//   minZoom: number;
//   component: React.ReactElement;
// };

type Overlays = Record<Overlay, boolean>;

export function CustomLayers() {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Overlays>({
    "GPS Routes": settings?.autoSelect?.gpsRoutes ?? false,
    Geograph: settings?.autoSelect?.geograph ?? false,
    "GeoDS POI": settings?.autoSelect?.geograph ?? false,
    "Company Data": settings?.autoSelect?.companyData ?? false,
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlayChecked((prevState) => ({
      ...prevState,
      [layer]: checked,
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

  return (
    <>
      <LayersControl.Overlay name="GPS Routes" checked={overlayChecked["GPS Routes"]}>
        <CustomLayerGroup enabled={overlayChecked["GPS Routes"]} minZoom={4}>
          <GpsRoutesLayer bounds={bounds} />
        </CustomLayerGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay name="Geograph" checked={overlayChecked["Geograph"]}>
        <CustomLayerGroup enabled={overlayChecked["Geograph"]} minZoom={4}>
          <GeographLayer bounds={bounds} />
        </CustomLayerGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay name="GeoDS POI" checked={overlayChecked["GeoDS POI"]}>
        <CustomLayerGroup enabled={overlayChecked["GeoDS POI"]} minZoom={9}>
          <GeodsPointsOfInterestLayer bounds={bounds} />
        </CustomLayerGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay name="Company Data" checked={overlayChecked["Company Data"]}>
        <CustomLayerGroup enabled={overlayChecked["Company Data"]} minZoom={11}>
          <CompanyDataLayer bounds={bounds} />
        </CustomLayerGroup>
      </LayersControl.Overlay>
    </>
  );
}

type CustomLayerGroupProps = {
  enabled: boolean;
  minZoom: number;
};

function CustomLayerGroup({ enabled, minZoom, children }: PropsWithChildren<CustomLayerGroupProps>) {
  const map = useMap();

  if (map.getZoom() < minZoom) {
    return null;
  }

  return <LayerGroup>{enabled && children}</LayerGroup>;
}
