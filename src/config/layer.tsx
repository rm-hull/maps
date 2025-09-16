import { createListCollection } from "@chakra-ui/react";
import { LatLngBounds } from "leaflet";
import { TileLayer } from "react-leaflet";
import { CompanyDataLayer } from "../components/map/layers/custom/CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "../components/map/layers/custom/GeodsPointsOfInterestLayer";
import { GeographLayer } from "../components/map/layers/custom/GeographLayer";
import { GpsRoutesLayer } from "../components/map/layers/custom/GpsRoutesLayer";
import { PostcodePolygonsLayer } from "../components/map/layers/custom/PostcodePolygonsLayer";
import { WeatherLayer } from "../components/map/layers/custom/WeatherLayer";

type Tile = {
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

function createLayer(name: string, provider: string, url: string, options?: L.TileLayerOptions): LayerOption {
  return {
    name,
    tiles: [{ url, options }],
    provider,
  };
}

const BASE_LAYERS: LayerOption[] = [
  createLayer("Positron", "Carto", "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"),
  createLayer("Dark Matter", "Carto", "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"),
  createLayer("Voyager", "Carto", "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"),

  createLayer(
    "World TopoMap",
    "ESRI",
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  ),
  createLayer(
    "World Imagery",
    "ESRI",

    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  ),
  createLayer(
    "World Gray Canvas",
    "ESRI",
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { maxNativeZoom: 16, maxZoom: 17 }
  ),
  createLayer("OpenStreetMap", "Open Street Map", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
  createLayer("OpenTopoMap", "Open Street Map", "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 15,
    maxNativeZoom: 15,
    opacity: 0.8,
  }),
  createLayer("CyclOSM", "Open Street Map", "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"),
  createLayer("Humanitarian", "Open Street Map", "https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png"),
  createLayer(
    "SLUB",
    "Open Street Map",
    "https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}{r}.png"
  ),
  createLayer(
    "Skobbler Night",
    "Open Street Map",
    "https://tiles2-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/2/{z}/{x}/{y}.png{r}?traffic=false"
  ),
  {
    name: "Leisure",
    provider: "Ordnance Survey",
    tiles: [
      {
        url: `${VITE_MAPPROXY_BASE_URL}/mapproxy/wmts/wmts/leisure_3857/grid_3857/{z}/{x}/{y}.png`,
        options: {
          tileSize: 256,
          maxZoom: 16,
          maxNativeZoom: 15,
          opacity: 0.8,
        },
      },
      {
        url: `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
        options: { minZoom: 17 },
      },
    ],
  },
  createLayer(
    "Roads",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    {
      minZoom: 17,
    }
  ),
  createLayer(
    "Outdoor",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    { minZoom: 17 }
  ),
  createLayer(
    "Light",
    "Ordnance Survey",
    `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
    {
      minZoom: 17,
    }
  ),
  createLayer("Alidade Satellite", "Stadia", "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"),
  createLayer(
    "Alidade Smooth Dark",
    "Stadia",
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
  ),
  createLayer("OSMBright", "Stadia", "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"),
  createLayer("Stamen Toner", "Stadia", "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"),
  createLayer("Stamen Watercolor", "Stadia", "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png"),
  createLayer(
    "Atlas",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createLayer(
    "Cycle",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),

  createLayer(
    "Landscape",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createLayer(
    "Mobile Atlas",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createLayer(
    "Neighbourhood",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createLayer(
    "Outdoors",
    "Thunderforest",
    `https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
  ),
  createLayer(
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
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={650}
      />
    ),
  },

  "Stadia Stamen Toner Labels": {
    minZoom: 6,
    component: () => (
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
        pane="overlayPane"
        zIndex={655}
      />
    ),
  },

  "NASA (GIBS) Snow Cover": {
    minZoom: 6,
    maxZoom: 8,
    component: () => (
      <TileLayer
        url="https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_NDSI_Snow_Cover/default/GoogleMapsCompatible_Level{maxZoom}/{z}/{y}/{x}.png"
        maxZoom={8}
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

  "MetOffice Rain Forcast": {
    minZoom: 6,
    component: () => (
      <WeatherLayer url="https://api.destructuring-bind.org/v1/metoffice/datahub/total_precipitation_rate/{y}/{m}/{d}/{h}.png" />
    ),
  },
};

export const baseLayers = createListCollection({
  items: BASE_LAYERS,
  groupBy: (item) => item.provider,
  itemToString: (item) => item.name,
  itemToValue: (item) => `${item.provider} / ${item.name}`,
});
