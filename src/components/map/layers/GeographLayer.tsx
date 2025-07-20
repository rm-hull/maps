import { LatLngBounds } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGeograph } from "../../../hooks/useGeograph";
import { GeographAttributionLink } from "../attribution/GeographAttributionLink";
import ResultPopup from "../ResultPopup";

interface GeographLayerProps {
  bounds: LatLngBounds;
}

export function GeographLayer({ bounds }: GeographLayerProps) {
  const map = useMap();

  const center = bounds.getCenter();
  const distance = map.distance(bounds.getSouthWest(), bounds.getNorthEast());

  const { data, error } = useGeograph(center, distance / 1000.0);
  useErrorToast("geograph-error", "Error loading Geograph images", error);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.map((item) => (
        <Marker key={item.guid} position={[parseFloat(item.lat), parseFloat(item.long)]}>
          <ResultPopup
            title={item.title.replace(/.* : /, "")}
            description={item.description?.replace(/Dist:.+?km.*?<br\/>/, "")}
            imageUrl={item.thumb.replace("_120x120", "")}
            targetUrl={item.link}
            attribution={<GeographAttributionLink name={item.author} date={item.imageTaken} link={item.source} />}
            chips={[item.category, ...tagSplitter(item.tags)].filter(Boolean)}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

function tagSplitter(tags?: string): string[] {
  if (!tags) {
    return [];
  }

  return tags
    .split(/\?/g)
    .filter((tag) => tag.startsWith("top:"))
    .flatMap((tag) => tag.substring(4).split(/, ?/g))
    .toSorted();
}
