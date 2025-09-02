import { LatLngBounds } from "leaflet";
import { TileLayer } from "react-leaflet";

interface TileOverlayProps extends L.TileLayerOptions {
  bounds: LatLngBounds;
  url: string;
}

export function TileOverlay({ bounds, url, ...opts }: TileOverlayProps) {
  return <TileLayer url={url} bounds={bounds} {...opts} />;
}
