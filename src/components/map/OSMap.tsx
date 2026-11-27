import "./SmoothWheelZoom";
import "proj4leaflet";
import * as L from "leaflet";
import { useMemo } from "react";
import { MapContainer, ScaleControl } from "react-leaflet";
import { baseLayers } from "../../config/layer";
import { DEFAULT_COORDINATE_DISPLAY, DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { toLatLng } from "../../services/osdatahub/helpers";
import { Loader } from "../Loader";
import { Coordinates } from "./controls/Coordinates";
import { CurrentLocation } from "./controls/CurrentLocation";
import { Layers } from "./controls/Layers";
import { Ruler } from "./controls/Ruler";
import { Settings } from "./controls/Settings";
import { ZoomLevel } from "./controls/ZoomLevel";
import { CustomOverlays } from "./CustomOverlays";
import { PointOfInterest } from "./PointOfInterest";
import { SearchBox } from "./search/SearchBox";
import { Tracks } from "./Tracks";

interface OSMapProps {
  center?: L.LatLng;
}

const maxBounds = new L.LatLngBounds([toLatLng([-238375.0, 0.0]), toLatLng([900000.0, 1376256.0])]);
const defaultCenter = toLatLng([337297, 503695]); // OSGB36 / British National Grid

export function OSMap({ center }: OSMapProps) {
  const { settings, isLoading } = useGeneralSettings();

  const customLocation = useMemo(
    () =>
      settings?.initialLocation === "custom" && settings.customLocation && center === undefined
        ? L.latLng(settings.customLocation.latLng)
        : undefined,
    [settings, center]
  );

  const initialMapStyle = useMemo(() => baseLayers.find(settings?.mapStyle), [settings?.mapStyle]);
  const coordinateDisplay = settings?.coordinateDisplay ?? DEFAULT_COORDINATE_DISPLAY;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <MapContainer
      zoom={settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL}
      minZoom={7}
      maxZoom={18}
      center={customLocation ?? center ?? defaultCenter}
      maxBounds={maxBounds}
      scrollWheelZoom={false}
      smoothWheelZoom={true}
      zoomSnap={0}
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
      {coordinateDisplay !== "none" && <Coordinates format={coordinateDisplay} position="bottomright" />}
      <ScaleControl position="bottomright" />
      <Ruler />
    </MapContainer>
  );
}
