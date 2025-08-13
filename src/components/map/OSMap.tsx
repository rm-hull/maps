import "proj4leaflet";
import * as L from "leaflet";
import { LayerGroup, LayersControl, MapContainer, ScaleControl, TileLayer } from "react-leaflet";
import { DEFAULT_ZOOM_LEVEL, useGeneralSettings } from "../../hooks/useGeneralSettings";
import { API_KEY } from "../../services/osdatahub";
import { crs, toLatLng } from "../../services/osdatahub/helpers";
import { CurrentLocation } from "../controls/CurrentLocation";
import { Ruler } from "../controls/Ruler";
import { Settings } from "../controls/Settings";
import { CustomLayers } from "./CustomLayers";
import { FlyToLocation } from "./FlyToLocation";
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
      crs={crs}
      zoom={settings?.initialZoomLevel ?? DEFAULT_ZOOM_LEVEL}
      minZoom={0}
      maxZoom={13}
      center={center ?? toLatLng([337297, 503695])}
      maxBounds={new L.LatLngBounds([toLatLng([-238375.0, 0.0]), toLatLng([900000.0, 1376256.0])])}
      scrollWheelZoom={true}
      style={{ width: "100vw", height: "100vh" }}
      attributionControl={false}
    >
      <PointOfInterest />
      <SearchBox />

      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Leisure" checked={settings?.mapStyle === "leisure"}>
          <LayerGroup>
            <TileLayer
              url={`https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=${API_KEY}`}
              maxZoom={9}
            />
            <TileLayer
              url={`https://api.os.uk/maps/raster/v1/zxy/Road_27700/{z}/{x}/{y}.png?key=${API_KEY}`}
              minZoom={10}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          name="Roads"
          checked={settings?.mapStyle === undefined || settings?.mapStyle === "roads"}
        >
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Road_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Outdoor" checked={settings?.mapStyle === "outdoor"}>
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Outdoor_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Light" checked={settings?.mapStyle === "light"}>
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Light_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>

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
