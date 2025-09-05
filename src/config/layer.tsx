import { LatLngBounds } from "leaflet";
import { TileLayer } from "react-leaflet";
import { CompanyDataLayer } from "../components/map/layers/custom/CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "../components/map/layers/custom/GeodsPointsOfInterestLayer";
import { GeographLayer } from "../components/map/layers/custom/GeographLayer";
import { GpsRoutesLayer } from "../components/map/layers/custom/GpsRoutesLayer";
import { PostcodePolygonsLayer } from "../components/map/layers/custom/PostcodePolygonsLayer";

type Tile = {
  url: string;
  options?: L.TileLayerOptions;
};

export type LayerOption = {
  name: string;
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

function createLayer(name: string, url: string, options?: L.TileLayerOptions): LayerOption {
  return {
    name,
    tiles: [{ url, options }],
  };
}

export const BASE_LAYERS: Record<string, LayerOption[]> = {
  Carto: [
    createLayer("Positron", "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"),
    createLayer("Dark Matter", "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"),
    createLayer("Voyager", "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"),
  ],
  ESRI: [
    createLayer(
      "World TopoMap",
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    ),
    createLayer(
      "World Imagery",
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    ),
    createLayer(
      "World Gray Canvas",
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      { maxNativeZoom: 16, maxZoom: 17 }
    ),
  ],
  "Open Street Map": [
    createLayer("OpenStreetMap", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    createLayer("OpenTopoMap", "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 15,
      maxNativeZoom: 15,
      opacity: 0.8,
    }),
    createLayer("CyclOSM", "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"),
    createLayer("Humanitarian", "https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png"),
    createLayer("SLUB", "https://tile-4.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/{z}/{x}/{y}{r}.png"),
    createLayer(
      "Skobbler Night",
      "https://tiles2-bc7b4da77e971c12cb0e069bffcf2771.skobblermaps.com/TileService/tiles/2.0/01021113210/2/{z}/{x}/{y}.png{r}?traffic=false"
    ),
  ],
  "Ordnance Survey": [
    {
      name: "Leisure",
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
    createLayer("Roads", `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`, {
      minZoom: 17,
    }),
    createLayer(
      "Outdoor",
      `https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`,
      { minZoom: 17 }
    ),
    createLayer("Light", `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${OS_DATAHUB_API_KEY}`, {
      minZoom: 17,
    }),
  ],
  Stadia: [
    createLayer("Alidade Satellite", "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"),
    createLayer("Alidade Smooth Dark", "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"),
    createLayer("OSMBright", "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"),
    createLayer("Stamen Toner", "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"),
    createLayer("Stamen Watercolor", "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png"),
  ],
  Thunderforest: [
    createLayer("Atlas", `https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`),
    createLayer("Cycle", `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`),

    createLayer(
      "Landscape",
      `https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
    ),
    createLayer(
      "Mobile Atlas",
      `https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
    ),
    createLayer(
      "Neighbourhood",
      `https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
    ),
    createLayer(
      "Outdoors",
      `https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
    ),
    createLayer(
      "Transport",
      `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}{r}.png?apikey=${THUNDERFOREST_API_KEY}`
    ),
  ],
  "Historic Maps": [
    createLayer(
      "OS 1:25,000 1937-1961",
      "https://api.maptiler.com/tiles/uk-osgb25k1937/{z}/{x}/{y}.jpg?key=7Y0Q1ck46BnB8cXXXg8X"
    ),
    createLayer("OS One Inch, 1885-1900", "https://mapseries-tilesets.s3.amazonaws.com/1inch_2nd_ed/{z}/{x}/{y}.png"),
    {
      name: "OS 25 Inch, 1892-1914",
      tiles: [
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/lincolnshire/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/nottinghamshire/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch/lancashire/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/yorkshire/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/Shrop_Derby/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/25_inch_holes_england/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/channel-islands/25-inch/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/wiltshire2nd/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/suffolk/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/cambridge/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/devon2nd/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/sussex/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/bedfordshire/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/dorset/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/kent/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/northumberland/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/hampshire/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch/great-yarmouth-addition/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/berkshire/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194125/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194119/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/135198775/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/middlesex/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/surrey/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/newcastle_addition/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/cornwall/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/huntingdon/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/rutland/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/103683170/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/essex/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/somerset/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch/132280016/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch/edinburgh_west/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/hertfordshire/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/103676684/{z}/{x}/{y}.png" },
        { url: "https://mapseries-tilesets.s3.amazonaws.com/25_inch/london/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/25_inch_holes_england/104194125/{z}/{x}/{y}.png" },
      ],
    },
    {
      name: "OS 1:1,250 A,B,C ed., 1948-1973",
      tiles: [
        { url: "https://geo.nls.uk/mapdata3/os/1250_A_1/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/maps/os/1250_B_1eng/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/maps/os/1250_C/{x}/{y}.png" },
      ],
    },
    {
      name: "OS 1:2,500 A ed., 1948-1974",
      tiles: [
        { url: "https://geo.nls.uk/maps/os/2500_A_3D/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_1D/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_1S/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_2D/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_3S/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_4S/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata2/os/2500_A_6D/{z}/{x}/{y}.png" },
        { url: "https://geo.nls.uk/mapdata3/os/2500_1974/{z}/{x}/{y}.png" },
      ],
    },

    createLayer("2nd Land Utilization Svy., 1:10k 1960s", "https://geo.nls.uk/mapdata2/lus_10k/{z}/{x}/{y}.png"),
    createLayer(
      "Bartholomew Half Inch 1897-1907",
      "https://mapseries-tilesets.s3.amazonaws.com/bartholomew_great_britain/{z}/{x}/{y}.png",
      {
        maxZoom: 15,
        maxNativeZoom: 15,
      }
    ),
    createLayer(
      "Bartholomew Half Inch 1940-1947",
      "https://mapseries-tilesets.s3.amazonaws.com/bartholomew/great_britain_1940s/{z}/{x}/{y}.png",
      {
        maxZoom: 14,
        maxNativeZoom: 14,
      }
    ),
  ],
};

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
};
