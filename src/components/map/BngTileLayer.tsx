import { type JSX, useEffect } from "react";
import { TileLayerProps, useMap } from "react-leaflet";
import * as L from "leaflet";
import { toBNG } from "../../services/osdatahub/helpers";

// Extend L.TileLayer to create a custom tile layer with BNG reprojection
class BngTileLayerClass extends L.TileLayer {
  private _url: string;
  constructor(url: string, options?: L.TileLayerOptions) {
    super(url, options);
    this._url = url;
  }

  getTileUrl(coords: L.Coords): string {
    // 1. Convert tile coordinates (x, y, z) to geographical coordinates (lat, lng)
    const map = L.map(document.createElement("div"), { crs: L.CRS.EPSG3857 }); // Use EPSG:3857 for standard tile coordinates
    const tileSize = 256; // Standard tile size
    const nwPoint = map.unproject([coords.x * tileSize, coords.y * tileSize], coords.z);
    const sePoint = map.unproject([(coords.x + 1) * tileSize, (coords.y + 1) * tileSize], coords.z);

    const centerPoint = L.latLng((nwPoint.lat + sePoint.lat) / 2, (nwPoint.lng + sePoint.lng) / 2);

    // 2. Reproject the geographical coordinates (lat, lng) to British National Grid (BNG)
    const [bngEasting, bngNorthing] = toBNG(centerPoint);

    // 3. Construct the tile URL using the reprojected coordinates
    const bngTileUrl = this._url
      .replace("{z}", String(coords.z))
      .replace("{x}", String(Math.round(bngEasting / 1000)))
      .replace("{y}", String(Math.round(bngNorthing / 1000)));

    return bngTileUrl;
  }
}

export function BngTileLayer({ url, ...props }: TileLayerProps): JSX.Element | null {
  const map = useMap();

  useEffect(() => {
    // Create an instance of the custom tile layer
    const tileLayer = new BngTileLayerClass(url, props);

    map.addLayer(tileLayer);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, url, props]);

  return null;
}
