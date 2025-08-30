import { LayersControl, TileLayer } from "react-leaflet";

export function WaymarkedTrailsLayers() {
  return (
    <>
      <LayersControl.Overlay name="Waymarked Hiking Trails">
        <TileLayer url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png" />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Waymarked Cycling Trails">
        <TileLayer url="https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png" />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Waymarked MTB Trails">
        <TileLayer url="https://tile.waymarkedtrails.org/mtb/{z}/{x}/{y}.png" />
      </LayersControl.Overlay>
    </>
  );
}
