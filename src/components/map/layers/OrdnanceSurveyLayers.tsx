import { LayerGroup, LayersControl, TileLayer } from "react-leaflet";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";
import { OS_DATAHUB_API_KEY } from "../../../services/osdatahub";

const VITE_MAPPROXY_BASE_URL = import.meta.env.VITE_MAPPROXY_BASE_URL as string | undefined;

export function OrdnanceSurveyLayers() {
  const [settings] = useGeneralSettings();

  return (
    <>
      {VITE_MAPPROXY_BASE_URL && (
        <LayersControl.BaseLayer name="Ordnance Survey: Leisure" checked={settings?.mapStyle === "leisure"}>
          <LayerGroup>
            <TileLayer
              url={`${VITE_MAPPROXY_BASE_URL}/mapproxy/wmts/wmts/leisure_3857/grid_3857/{z}/{x}/{y}.png`}
              tileSize={256}
              maxZoom={17}
              maxNativeZoom={17}
              opacity={0.8}
            />
            <TileLayer
              url={`https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`}
              minZoom={16}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
      )}
      <LayersControl.BaseLayer
        name="Ordnance Survey: Roads"
        checked={settings?.mapStyle === undefined || settings?.mapStyle === "roads"}
      >
        <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Ordnance Survey: Outdoor" checked={settings?.mapStyle === "outdoor"}>
        <TileLayer
          url={`https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`}
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Ordnance Survey: Light" checked={settings?.mapStyle === "light"}>
        <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`} />
      </LayersControl.BaseLayer>
    </>
  );
}
