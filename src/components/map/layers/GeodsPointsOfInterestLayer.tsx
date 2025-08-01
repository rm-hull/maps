import { Icon, type LatLngBounds } from "leaflet";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGeodsPOI } from "../../../hooks/useGeodsPOI";
import { fetchUnsplashImage } from "../../../services/geods";
import { ImageLoaderFn } from "../../FadeInImage";
import { UnsplashAttributionLink } from "../attribution/UnsplashAttributionLink";
import ResultPopup from "../ResultPopup";

interface GeodsPointsOfInterestLayerProps {
  bounds: LatLngBounds;
}

export function GeodsPointsOfInterestLayer({ bounds }: GeodsPointsOfInterestLayerProps) {
  const { data, error } = useCachedQuery(useGeodsPOI(bounds));
  useErrorToast("geods-poi-error", "Error loading GeoDS POI", error);

  const imageLoaderMap = useMemo(() => {
    const cache = new Map<string, ImageLoaderFn>();
    return (categories?: string[]) => {
      const key = categories?.[0] || "unknown";
      if (!cache.has(key)) {
        cache.set(key, async () => {
          const photo = await fetchUnsplashImage(key);
          return {
            src: photo.src,
            alt: photo.alt,
            attribution: <UnsplashAttributionLink name={photo.attribution.name} link={photo.attribution.link} />,
          };
        });
      }
      return cache.get(key)!;
    };
  }, []);

  return (
    <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} removeOutsideVisibleBounds>
      {data?.results?.map((result) => (
        <Marker key={result.id} position={[result.lat, result.long]} icon={categoryIcon(result.categories?.[0])}>
          <ResultPopup
            title={result.primary_name}
            description={[result.address, result.locality, result.postcode]
              .map((field) => field?.trim())
              .filter((field) => !!field)
              .join(", ")}
            chips={result.categories}
            imageLoader={imageLoaderMap(result.categories)}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

function categoryIcon(category?: string) {
  const url = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/${category?.toLowerCase() || "unknown"}`;
  const shadowUrl = `${import.meta.env.VITE_GEODS_POI_API_URL}v1/geods-poi/marker/shadow`;
  return new Icon({
    popupAnchor: [1, -34],
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    iconUrl: url,
    iconRetinaUrl: url,
    shadowUrl: shadowUrl,
    shadowSize: [51, 37],
    shadowAnchor: [23, 35],
  });
}
