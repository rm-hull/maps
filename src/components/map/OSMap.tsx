import "proj4leaflet";
import * as L from "leaflet";
import { useMemo } from "react";
import { MapContainer, ScaleControl } from "react-leaflet";
import { BASE_LAYERS } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { toLatLng } from "../../services/osdatahub/helpers";
import { CurrentLocation } from "../controls/CurrentLocation";
import { Ruler } from "../controls/Ruler";
import { Settings } from "../controls/Settings";
import { CustomOverlays } from "./CustomOverlays";
import { LayerControl } from "./layers/LayerControl";
import { PointOfInterest } from "./PointOfInterest";
import { SearchBox } from "./SearchBox";
import { Tracks } from "./Tracks";

interface OSMapProps {
  center?: L.LatLng;
}

const maxBounds = new L.LatLngBounds([toLatLng([-238375.0, 0.0]), toLatLng([900000.0, 1376256.0])]);
const defaultCenter = toLatLng([337297, 503695]); // OSGB36 / British National Grid

export function OSMap({ center }: OSMapProps) {
  const [settings] = useGeneralSettings();

  const customLocation = useMemo(
    () =>
      settings?.initialLocation === "custom" && settings.customLocation && center === undefined
        ? L.latLng(settings.customLocation.latLng)
        : undefined,
    [settings?.initialLocation, settings?.customLocation, center]
  );

  if (!settings) {
    return null;
  }

  return (
    <MapContainer
      zoom={settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL}
      minZoom={7}
      maxZoom={18}
      center={customLocation ?? center ?? defaultCenter}
      maxBounds={maxBounds}
      scrollWheelZoom={true}
      style={{ width: "100vw", height: "100vh" }}
      attributionControl={false}
    >
      <PointOfInterest />
      <SearchBox />
      <CurrentLocation active={settings?.initialLocation === "current" && center === undefined} />
      <Tracks />
      <Settings />
      <LayerControl initialLayer={BASE_LAYERS.ESRI[0]} /> {/* TODO: make configurable*/}
      <CustomOverlays />
      <ScaleControl position="bottomright" />
      <Ruler />
    </MapContainer>
  );
}
