import * as L from "leaflet";
import "proj4leaflet";
import { type JSX } from "react";
import { LayerGroup, LayersControl, MapContainer, ScaleControl, TileLayer } from "react-leaflet";
import { API_KEY } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import CurrentLocation from "../controls/CurrentLocation";
import Settings from "../controls/Settings";
import ImagesLayer from "./ImagesLayer";
import PointOfInterest from "./PointOfInterest";

// Setup the EPSG:27700 (British National Grid) projection.
const crs = new L.Proj.CRS(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",
  {
    resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
    origin: [-238375.0, 1376256.0],
  }
);

interface OSMapProps {
  center?: L.LatLngTuple;
}

export default function OSMap({ center }: OSMapProps): JSX.Element {
  return (
    <MapContainer
      crs={crs}
      zoom={7}
      minZoom={0}
      maxZoom={13}
      center={center ?? toLatLng([337297, 503695])}
      maxBounds={[toLatLng([-238375.0, 0.0]), toLatLng([900000.0, 1376256.0])]}
      scrollWheelZoom={true}
      style={{ width: "100vw", height: "100vh" }}
      attributionControl={false}
    >
      <PointOfInterest />

      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Leisure">
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
        <LayersControl.BaseLayer name="Roads" checked>
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Road_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Outdoor">
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Outdoor_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Light">
          <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Light_27700/{z}/{x}/{y}.png?key=${API_KEY}`} />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay name="Geograph">
          <ImagesLayer minZoom={10} />
        </LayersControl.Overlay>
      </LayersControl>
      <CurrentLocation />
      <Settings />
      <ScaleControl position="bottomright" />
    </MapContainer>
  );
}
