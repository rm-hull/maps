import "proj4leaflet";
import * as L from "leaflet";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, ScaleControl } from "react-leaflet";
import { baseLayers } from "../../config/layer";
import { DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { toLatLng } from "../../services/osdatahub/helpers";
import { Loader } from "../Loader";
import { CurrentLocation } from "./controls/CurrentLocation";
import { Layers } from "./controls/Layers";
import { Ruler } from "./controls/Ruler";
import { Settings } from "./controls/Settings";
import { ZoomLevel } from "./controls/ZoomLevel";
import { Share } from "./controls/Share";
import { StateRestorer } from "./StateRestorer";
import { decodeState } from "@/utils/share";
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
  const [searchParams] = useSearchParams();
  const { settings, isLoading } = useGeneralSettings();

  const sharedStateEncoded = searchParams.get("s");
  const sharedState = useMemo(() => (sharedStateEncoded ? decodeState(sharedStateEncoded) : null), [sharedStateEncoded]);

  const effectiveSettings = useMemo(
    () => (sharedState?.settings ? { ...settings, ...sharedState.settings } : settings),
    [settings, sharedState]
  );

  const customLocation = useMemo(
    () =>
      effectiveSettings?.initialLocation === "custom" && effectiveSettings.customLocation && center === undefined
        ? L.latLng(effectiveSettings.customLocation.latLng)
        : undefined,
    [effectiveSettings, center]
  );

  const initialMapStyle = useMemo(() => baseLayers.find(effectiveSettings?.mapStyle), [effectiveSettings?.mapStyle]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <MapContainer
      zoom={effectiveSettings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL}
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
      <Share />
      <Layers defaultLayer={initialMapStyle ?? baseLayers.at(0)!} />
      <CustomOverlays />
      <ZoomLevel />
      <ScaleControl position="bottomright" />
      <Ruler />
      <StateRestorer />
    </MapContainer>
  );
}
