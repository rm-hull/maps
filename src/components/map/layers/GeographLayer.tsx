import { Marker, useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ResultPopup from "../ResultPopup";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGeograph } from "../../../hooks/useGeograph";

interface GeographLayerProps {
  bounds: LatLngBounds;
}

export function GeographLayer({ bounds }: GeographLayerProps) {
  const map = useMap();

  const center = bounds.getCenter();
  const distance = map.distance(center, bounds.getNorthEast()) * 1.5;

  const { data, error } = useGeograph(center, distance / 1000.0);
  useErrorToast("geograph-error", "Error loading Geograph images", error);

  // if (data === undefined || error !== undefined) {
  //   return null;
  // }

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.map((item) => (
        <Marker key={item.guid} position={[parseFloat(item.lat), parseFloat(item.long)]}>
          <ResultPopup
            title={item.title.replace(/.* : /, "")}
            description={item.description?.replace(/Dist:.+?km.*?<br\/>/, "")}
            imageUrl={item.thumb.replace("_120x120", "")}
            targetUrl={item.link}
            attribution={`[${item.author}, ${item.imageTaken}]`}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
