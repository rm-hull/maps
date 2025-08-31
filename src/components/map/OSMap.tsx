import "proj4leaflet";
import * as L from "leaflet";
import { LayersControl, MapContainer, ScaleControl, TileLayer } from "react-leaflet";
import { DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { toLatLng } from "../../services/osdatahub/helpers";
import { CurrentLocation } from "../controls/CurrentLocation";
import { Ruler } from "../controls/Ruler";
import { Settings } from "../controls/Settings";
import { FlyToLocation } from "./FlyToLocation";
import { CustomLayers } from "./layers/CustomLayers";
import { OrdnanceSurveyLayers } from "./layers/OrdnanceSurveyLayers";
import { ThunderforestLayers } from "./layers/ThunderforestLayers";
import { WaymarkedTrailsLayers } from "./layers/WaymarkedTrailsLayers";
import { PointOfInterest } from "./PointOfInterest";
import { SearchBox } from "./SearchBox";
import { Tracks } from "./Tracks";

interface OSMapProps {
  center?: L.LatLng;
}

export function OSMap({ center }: OSMapProps) {
  const [settings] = useGeneralSettings();

  return (
    <MapContainer
      zoom={settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL}
      minZoom={7}
      maxZoom={18}
      center={center ?? toLatLng([337297, 503695])}
      maxBounds={new L.LatLngBounds([toLatLng([-238375.0, 0.0]), toLatLng([900000.0, 1376256.0])])}
      scrollWheelZoom={true}
      style={{ width: "100vw", height: "100vh" }}
      attributionControl={false}
    >
      <PointOfInterest />
      <SearchBox />

      <LayersControl position="topright">
        <LayersControl.BaseLayer name="ESRI World TopoMap">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ESRI World Imagery">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carto Dark Matter">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carto Voyager">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="SLUB (OSM)">
          <TileLayer url="https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}@2x.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Skobbler Night (OSM)">
          <TileLayer url="https://tiles2-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/2/{z}/{x}/{y}.png@2x?traffic=false" />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={15}
            maxNativeZoom={15}
            opacity={0.8}
          />
        </LayersControl.BaseLayer>

        <OrdnanceSurveyLayers />
        <ThunderforestLayers />
        <WaymarkedTrailsLayers />
        <LayersControl.Overlay name="NASA (GIBS) Snow Cover">
          <TileLayer
            url="https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_NDSI_Snow_Cover/default/GoogleMapsCompatible_Level{maxZoom}/{z}/{y}/{x}.png"
            maxZoom={8}
          />
        </LayersControl.Overlay>
        <CustomLayers />
      </LayersControl>

      <CurrentLocation active={settings?.initialLocation === "current" && center === undefined} />
      <FlyToLocation
        latLng={
          settings?.initialLocation === "custom" && settings.customLocation && center === undefined
            ? L.latLng(settings.customLocation.latLng)
            : undefined
        }
      />
      <Tracks />
      <Settings />
      <ScaleControl position="bottomright" />
      <Ruler />
    </MapContainer>
  );
}
