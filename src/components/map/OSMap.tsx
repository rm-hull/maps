import "proj4leaflet";
import * as L from "leaflet";
import { useMemo } from "react";
import { MapContainer, ScaleControl } from "react-leaflet";
import { baseLayers } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { toLatLng } from "../../services/osdatahub/helpers";
import { CurrentLocation } from "./controls/CurrentLocation";
import { Layers } from "./controls/Layers";
import { Ruler } from "./controls/Ruler";
import { Settings } from "./controls/Settings";
import { ZoomLevel } from "./controls/ZoomLevel";
import { CustomOverlays } from "./CustomOverlays";
import { WeatherLayer } from "./layers/custom/WeatherLayer";
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

  const initialMapStyle = useMemo(() => baseLayers.find(settings?.mapStyle), [settings?.mapStyle]);

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
      <Layers defaultLayer={initialMapStyle ?? baseLayers.at(0)!} />
      <CustomOverlays />
      <ZoomLevel />
      <ScaleControl position="bottomright" />
      <Ruler />
      <WeatherLayer />
    </MapContainer>
  );
}
