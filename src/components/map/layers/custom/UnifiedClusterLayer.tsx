import { type LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CompanyDataLayer } from "./CompanyDataLayer";
import { GeodsPointsOfInterestLayer } from "./GeodsPointsOfInterestLayer";
import { GeographLayer } from "./GeographLayer";
import { GpsRoutesLayer } from "./GpsRoutesLayer";

interface UnifiedClusterLayerProps {
  bounds: LatLngBounds;
}

// Define min/max zoom for each layer
const LAYER_ZOOM = {
  gpsRoutes: { minZoom: 10 },
  geograph: { minZoom: 16 },
  geodsPoi: { minZoom: 14 },
  companyData: { minZoom: 16 },
} as const;

export function UnifiedClusterLayer({ bounds }: UnifiedClusterLayerProps) {
  const map = useMap();
  const currentZoom = map.getZoom();

  const shouldRenderLayer = (minZoom: number) => {
    return currentZoom > minZoom;
  };

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {shouldRenderLayer(LAYER_ZOOM.gpsRoutes.minZoom) && <GpsRoutesLayer bounds={bounds} />}
      {shouldRenderLayer(LAYER_ZOOM.geograph.minZoom) && <GeographLayer bounds={bounds} />}
      {shouldRenderLayer(LAYER_ZOOM.geodsPoi.minZoom) && <GeodsPointsOfInterestLayer bounds={bounds} />}
      {shouldRenderLayer(LAYER_ZOOM.companyData.minZoom) && <CompanyDataLayer bounds={bounds} />}
    </MarkerClusterGroup>
  );
}
