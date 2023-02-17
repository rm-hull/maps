import * as L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";

const apiKey = process.env.REACT_APP_API_KEY;

// Setup the EPSG:27700 (British National Grid) projection.
const crs = new L.Proj.CRS(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",
  {
    resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
    origin: [-238375.0, 1376256.0],
  }
);

// Transform coordinates.
function transformCoords(arr: [number, number]): [number, number] {
  return proj4("EPSG:27700", "EPSG:4326", arr).reverse() as [number, number];
}

type OSMapProps = {
  center?: [number, number];
};

export default function OSMap({ center }: OSMapProps) {
  return (
    <MapContainer
      crs={crs}
      zoom={7}
      minZoom={0}
      maxZoom={13}
      center={center ?? transformCoords([337297, 503695])}
      maxBounds={[transformCoords([-238375.0, 0.0]), transformCoords([900000.0, 1376256.0])]}
      scrollWheelZoom={false}
      style={{ width: "100vw", height: "100vh" }}
      attributionControl={false}
    >
      <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=${apiKey}`} maxZoom={9} />
      <TileLayer url={`https://api.os.uk/maps/raster/v1/zxy/Road_27700/{z}/{x}/{y}.png?key=${apiKey}`} minZoom={10} />
      <LocationMarker />
    </MapContainer>
  );
}