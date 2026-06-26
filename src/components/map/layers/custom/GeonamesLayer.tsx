import { type LatLngBounds } from "leaflet";
import hash from 'object-hash';
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useCachedQuery } from "@/hooks/useCachedQuery";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useGeonames } from "@/hooks/useGeonames";
import { orangeMarker } from "@/icons";
import { ResultPopup } from "../../ResultPopup";

interface GeonamesLayerProps {
  bounds: LatLngBounds;
}

export function GeonamesLayer({ bounds }: GeonamesLayerProps) {
  const { data, error } = useCachedQuery(useGeonames(bounds));
  useErrorToast("geonames-error", "Error loading Geonames", error);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.map((result) => (
        <Marker key={result.geoNameId ?? result.wikipediaUrl} position={[result.lat, result.lng]} icon={orangeMarker}>
          <ResultPopup
            title={result.title}
            description={result.summary}
            imageUrl={result.thumbnailImg}
            targetUrl={result.wikipediaUrl.startsWith("http") ? result.wikipediaUrl.replace(/^http:/, "https:") : "https://" + result.wikipediaUrl}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
