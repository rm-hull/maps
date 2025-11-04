import { createListCollection } from "@chakra-ui/react";
import { LatLngBounds } from "leaflet";
import { TileLayer, WMSTileLayer } from "react-leaflet";
import { CompanyDataLayer } from "../components/map/layers/custom/CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "../components/map/layers/custom/GeodsPointsOfInterestLayer";
import { GeographLayer } from "../components/map/layers/custom/GeographLayer";
import { GpsRoutesLayer } from "../components/map/layers/custom/GpsRoutesLayer";
import { PostcodePolygonsLayer } from "../components/map/layers/custom/PostcodePolygonsLayer";
import { StreetManagerLayer } from "../components/map/layers/custom/StreetManagerLayer";
import { WeatherLayer } from "../components/map/layers/custom/WeatherLayer";
import { Scale } from "../components/map/Scale";

const RAIN_RATE_SCALE = [
  { color: "#FFFFFF00", value: "0" },
  { color: "#80FFFF" },
  { color: "#00FFFF", value: "0.2" },
  { color: "#00C0FF" },
  { color: "#0080FF", value: "1" },
  { color: "#0040FF" },
  { color: "#0000FF", value: "3" },
  { color: "#0040C0" },
  { color: "#008080", value: "5" },
  { color: "#00C040" },
  { color: "#00FF00", value: "7" },
  { color: "#40FF00" },
  { color: "#80FF00", value: "9" },
  { color: "#C0FF00" },
  { color: "#FFFF00", value: "15" },
  { color: "#FFC000" },
  { color: "#FF8000", value: "25" },
  { color: "#FF6000" },
  { color: "#FF4000", value: "35" },
  { color: "#FF2000" },
  { color: "#FF0000", value: "45" },
  { color: "#C00000" },
  { color: "#800000", value: "55" },
  { color: "#800020" },
  { color: "#800040" },
  { color: "#800080", value: "150" },
];

export type Tile = {
  type: "raster" | "vector";
  url: string;
  options?: L.TileLayerOptions;
};

export type LayerOption = {
  name: string;
  provider: string;
  tiles: Tile[];
  attribution?: string;
};

export type Overlay = {
  minZoom: number;
  maxZoom?: number;
  component: React.ComponentType<{ bounds: LatLngBounds }>;
};

const VITE_MAPPROXY_BASE_URL = import.meta.env.VITE_MAPPROXY_BASE_URL as string | undefined;
const OS_DATAHUB_API_KEY = import.meta.env.VITE_OS_DATAHUB_API_KEY as string | undefined;
const THUNDERFOREST_API_KEY = import.meta.env.VITE_THUNDERFOREST_API_KEY as string | undefined;
const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY as string | undefined;

function createRasterLayer(name: string, provider: string, url: string, options?: L.TileLayerOptions): LayerOption {
  return {
    name,
    tiles: [{ url, options, type: "raster" }],
    provider,
  };
}

function createVectorLayer(name: string, provider: string, url: string): LayerOption {
  return {
    name,
    provider,
    tiles: [
      {
        type: "vector",
        url,
      },
    ],
  };
}

const BASE_LAYERS: LayerOption[] = [
  createRasterLayer("Positron", "Carto", "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"),
  createRasterLayer("Dark Matter", "Carto", "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"),
  createRasterLayer("Voyager", "Carto", "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"),

  createRasterLayer(
    "World TopoMap",
    "ESRI",
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  ),
  createRasterLayer(
    "World Imagery",
    "ESRI",

    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  ),
  createRasterLayer(
    "World Gray Canvas",
    "ESRI",
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { maxNativeZoom: 16, maxZoom: 17 }
  ),
  {
    name: "OpenFreeMap",
    provider: "Open Street Map",
    tiles: [
      {
        type: "vector",
        url: "https://tiles.openfreemap.org/styles/liberty",
      },
    ],
  },
  createRasterLayer("OpenStreetMap", "Open Street Map", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
  createRasterLayer("OpenTopoMap", "Open Street Map", "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 15,
    maxNativeZoom: 15,
    opacity: 0.8,
  }),
  createRasterLayer("CyclOSM", "Open Street Map", "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"),
  createRasterLayer("Humanitarian", "Open Street Map", "https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png"),
  createRasterLayer(
    "SLUB",
    "Open Street Map",
    "https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}{r}.png"
  ),
  createRasterLayer(
    "Skobbler Night",
    "Open Street Map",
    "https://tiles2-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/2/{z}/{x}/{y}.png{r}?traffic=false"
  ),
  {
    name: "Leisure",
    provider: "Ordnance Survey",
    tiles: [
      {
        type: "raster",
        url: `${VITE_MAPPROXY_BASE_URL}/mapproxy/wmts/wmts/leisure_3857/grid_3857/{z}/{x}/{y}.png`,
        options: {
          tileSize: 256,
          maxZoom: 16,
          maxNativeZoom: 15,
          opacity: 0.8,
        },
      },
      {
        type: "raster",
        url: `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
        options: { minZoom: 17 },
      },
    ],
  },
  createRasterLayer(
    "Roads",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    {
      minZoom: 17,
    }
  ),
  createRasterLayer(
    "Outdoor",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    { minZoom: 17 }
  ),
  createRasterLayer(
    "Light",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    {
      minZoom: 17,
    }
  ),
  createVectorLayer("Alidade Smooth", "Stadia", "https://tiles-eu.stadiamaps.com/styles/alidade_smooth.json"),
  createVectorLayer("Alidade Smooth Dark", "Stadia", "https://tiles-eu.stadiamaps.com/styles/alidade_smooth_dark.json"),
  createVectorLayer("OSMBright", "Stadia", "https://tiles-eu.stadiamaps.com/styles/osm_bright.json"),
  createVectorLayer("Stamen Toner", "Stadia", "https://tiles-eu.stadiamaps.com/styles/stamen_toner.json"),
  createVectorLayer("Stamen Watercolor", "Stadia", "https://tiles-eu.stadiamaps.com/styles/stamen_watercolor.json"),
  createVectorLayer("Terrain", "Stadia", "https://tiles-eu.stadiamaps.com/styles/stamen_terrain.json"),
  createRasterLayer(
    "Atlas",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createRasterLayer(
    "Cycle",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),

  createRasterLayer(
    "Landscape",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createRasterLayer(
    "Mobile Atlas",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createRasterLayer(
    "Neighbourhood",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createRasterLayer(
    "Outdoors",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createRasterLayer(
    "Transport",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
];

export const OVERLAYS: Record<string, Overlay> = {
  "GPS Routes": { minZoom: 10, component: GpsRoutesLayer },
  Geograph: { minZoom: 16, component: GeographLayer },
  "GeoDS POI": { minZoom: 14, component: GeodsPointsOfInterestLayer },
  "Company Data": { minZoom: 16, component: CompanyDataLayer },
  Postcodes: { minZoom: 11, component: PostcodePolygonsLayer },
  "Street Manager": { minZoom: 15, component: StreetManagerLayer },
  Graticules: {
    minZoom: 6,

    // component: () => <TileLayer url="http://localhost:8080/tiles/{z}/{x}/{y}" pane="overlayPane" zIndex={650} />,
    component: () => <TileLayer url="http://localhost:8080/styles/graticule.json" pane="overlayPane" zIndex={650} />,
  },
  "Waymarked Hiking Trails": {
    minZoom: 6,
    component: () => (
      <TileLayer url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png" pane="overlayPane" zIndex={650} />
    ),
  },
  "Waymarked Cycling Trails": {
    minZoom: 6,
    component: () => (
      <TileLayer url="https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png" pane="overlayPane" zIndex={650} />
    ),
  },
  "Waymarked MTB Trails": {
    minZoom: 6,
    component: () => (
      <TileLayer url="https://tile.waymarkedtrails.org/mtb/{z}/{x}/{y}.png" pane="overlayPane" zIndex={650} />
    ),
  },
  "Positron Labels": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={655}
      />
    ),
  },

  "Dark Matter Labels": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={655}
      />
    ),
  },

  "Stadia Stamen Toner Lines": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://tiles-eu.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={650}
      />
    ),
  },

  "Stadia Stamen Toner Labels": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://tiles-eu.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={655}
      />
    ),
  },

  "NASA (GIBS) Snow Cover": {
    minZoom: 6,
    component: () => (
      // https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?width=392&height=827&bbox=-171077.81664331246%2C7163686.040024497%2C-170609.6398451053%2C7164673.749749286&crs=EPSG%3A3857&format=image%2Fpng&request=GetMap&service=WMS&styles=&transparent=TRUE&version=1.3.0&layers=MODIS_Aqua_L3_NDSI_Snow_Cover_Daily%2CMODIS_Aqua_L3_Snow_Cover_Monthly_Average_Pct%2CMODIS_Aqua_NDSI_Snow_Cover%2CMODIS_Terra_L3_NDSI_Snow_Cover_Daily%2CMODIS_Terra_L3_Snow_Cover_Monthly_Average_Pct%2CMODIS_Terra_NDSI_Snow_Cover&time=1948-01-01T00%3A00%3A00Z%2F1955-10-09T19%3A12%3A00Z
      <TileLayer
        url="https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_NDSI_Snow_Cover/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png"
        maxNativeZoom={8}
        pane="overlayPane"
        zIndex={650}
      />
    ),
  },

  "Light Pollution / Dark Skies, 2016": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://mapseries-tilesets.s3.amazonaws.com/light-pollution/{z}/{x}/{y}.png"
        maxNativeZoom={9}
        opacity={0.6}
        zIndex={650}
      />
    ),
  },

  "TomTom Traffic Flow": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}&tileSize=512&thickness=5`}
        pane="overlayPane"
        zIndex={650}
      />
    ),
  },

  "MetOffice Rain Forecast": {
    minZoom: 6,
    component: () => (
      <WeatherLayer
        url="https://api.destructuring-bind.org/v1/metoffice/datahub/total_precipitation_rate/{y}/{m}/{d}/{h}.png"
        zIndex={660}
        scale={<Scale label="Rain (mm/h):" values={RAIN_RATE_SCALE} />}
      />
    ),
  },
  "MetOffice Cloud Cover": {
    minZoom: 6,
    component: () => (
      <WeatherLayer
        url="https://api.destructuring-bind.org/v1/metoffice/datahub/cloud_amount_total/{y}/{m}/{d}/{h}.png"
        zIndex={659}
        opacity={0.8}
        scale={
          <Scale
            label="Cloud Cover (%):"
            width={30}
            values={[
              { color: "#00000000", value: "0" },
              { color: "#FFFFFF40", value: "25" },
              { color: "#FFFFFF80", value: "50" },
              { color: "#FFFFFF8B", value: "75" },
              { color: "#FFFFFF", value: "100" },
            ]}
          />
        }
      />
    ),
  },
  "DEFRA Flood Risk": {
    minZoom: 6,
    component: () => (
      <WMSTileLayer
        url="https://api.agrimetrics.co.uk/geoservices/datasets/f3d63ec5-a21a-49fb-803a-0fa0fb7238b6/wms"
        params={{
          service: "WMS",
          version: "1.1.1",
          request: "GetMap",
          width: 256,
          height: 256,
          layers: "Flood_Risk_Areas",
          format: "image/png",
          transparent: true,
        }}
        pane="overlayPane"
        zIndex={650}
      />
    ),
  },
};

export const baseLayers = createListCollection({
  items: BASE_LAYERS,
  groupBy: (item) => item.provider,
  itemToString: (item) => item.name,
  itemToValue: (item) => `${item.provider} / ${item.name}`,
});

export function isHighDefinitionTileSet(tile: Tile) {
  return tile.type === "vector" || tile.url.includes("@2x") || tile.url.includes("{r}");
}
